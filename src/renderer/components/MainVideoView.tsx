/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import * as React from 'react';
import { Track } from 'livekit-client';
import { Box } from '@mui/material';
import VideoItem from './VideoItem';
import VideoItemPlaceholder from './VideoItemPlaceholder';
import { ChildWindowContext } from './WindowPortal';
import VideoOverlay from './VideoOverlay';
import useHideOnMouseStop from '../hooks/useHideOnMouseStop';
import VideoEmptyMessage from './VideoEmptyMessage';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setWindowOpen } from '../redux/VideoViewSlice';
import type { VideoItemsObject } from '../lib/ExtendedUseRoom';
import { selectCurrentRoom } from '../redux/CurrentRoomSlice';
import { selectTeam } from '../redux/WorldSlice';

export interface MainVideoViewProps {
  setIsPopout: (sid: string, isPopout: boolean) => void;
  videoItems: VideoItemsObject;
}

function MainVideoView(props: MainVideoViewProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const { setIsPopout, videoItems } = props;
  const [focus, setFocus] = React.useState('');
  const [isFocusView, setIsFocusView] = React.useState(false);
  const windowRef = React.useContext(ChildWindowContext);
  const thisWindow = windowRef.current;
  const [
    hideOverlay,
    onOverlayMouseEnter,
    onOverlayMouseLeave,
    onOverlayMouseMove,
  ] = useHideOnMouseStop({
    delay: 3000,
    hideCursor: true,
    initialHide: false,
    showOnlyOnContainerHover: true,
    targetDoc: windowRef?.current?.document,
  });
  const dispatch = useAppDispatch();
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const teamInfo = useAppSelector((state) =>
    selectTeam(state, currentRoom.teamId)
  );

  React.useEffect(() => {
    console.log('MainVideoView Mounted');
    setIsMounted(true);

    return () => {
      setIsMounted(false);
      console.log('MainVideoView Unmounted');
    };
  }, []);

  React.useEffect(() => {
    if (isMounted && focus !== '' && !videoItems[focus]) {
      setIsFocusView(false);
      setFocus('');
    }
  }, [focus, isMounted, videoItems]);

  const handleVideoClickEvent = React.useCallback(
    (sid: string) =>
      (event: React.MouseEvent<HTMLVideoElement | HTMLElement>) => {
        const target = event.target as HTMLVideoElement | HTMLElement;
        if (target.localName === 'video') {
          setFocus(sid);
          setIsFocusView(true);
        }
      },
    []
  );

  const escKeydownHandler = React.useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFocusView(false);
      setFocus('');
    }
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      if (thisWindow) {
        thisWindow.addEventListener('keydown', escKeydownHandler);
      }
      return () => {
        if (thisWindow) {
          thisWindow.removeEventListener('keydown', escKeydownHandler);
        }
      };
    }
    return () => {};
  }, [escKeydownHandler, isMounted, thisWindow]);

  const focusVideoItem = videoItems[focus];
  const focusUserName =
    teamInfo?.users.find((u) => u.oid === focusVideoItem?.userId)?.name ??
    'Unknown';

  const gridItems = Object.entries(videoItems).map(([sid, videoItem]) => {
    const { userId, isPopout, isLocal, videoTrack } = videoItem;
    const userName =
      teamInfo?.users.find((u) => u.oid === userId)?.name ?? 'Unknown';

    if (!videoTrack) return null;

    const isFocusItem = focus === sid;
    const sourceType = videoTrack.source;
    const isScreen = sourceType === Track.Source.ScreenShare;
    const sourceNameLocal = `Your ${isScreen ? 'Screen' : 'Camera'}`;
    const sourceNameRemote = `${userName}'s ${isScreen ? 'Screen' : 'Camera'}`;
    const sourceName = isLocal ? sourceNameLocal : sourceNameRemote;
    const placeholderMessage = `${sourceName} is playing in a popout window`;

    return (
      <Box
        key={sid}
        hidden={isFocusView && !isFocusItem}
        // style={isFocusItem ? gridItemFocusStyle : {}}
      >
        <Box
          // style={isFocusItem ? gridBoxFocusStyle : gridBoxStyle}
          onClick={handleVideoClickEvent(sid)}
        >
          {videoItem.isPopout ? (
            <VideoItemPlaceholder
              message={placeholderMessage}
              buttonText="Restore"
              buttonAction={() => setIsPopout(sid, false)}
            />
          ) : (
            <>
              <VideoItem videoTrack={videoTrack} isLocal={isLocal} />
              <VideoOverlay
                sid={sid}
                isFocusItem={isFocusItem}
                userName={userName}
                isPopout={isPopout}
                isLocal={isLocal}
                sourceType={sourceType}
                hidden={isFocusView}
                setFocus={setFocus}
                setIsFocusView={setIsFocusView}
                setIsPopout={setIsPopout}
              />
            </>
          )}
        </Box>
      </Box>
    );
  });

  const isEmpty = Object.keys(videoItems).length === 0;

  const handleClose = React.useCallback(() => {
    dispatch(setWindowOpen(false));
  }, [dispatch]);

  if (isEmpty) {
    return (
      <VideoEmptyMessage
        message="No one is sharing their camera or screen."
        buttonText="Close"
        buttonAction={handleClose}
      />
    );
  }

  return (
    <Box
      // style={isFocusView ? gridFocusStyle : gridStyle}
      onMouseEnter={isFocusView ? onOverlayMouseEnter : () => {}}
      onMouseLeave={isFocusView ? onOverlayMouseLeave : () => {}}
      onMouseMove={isFocusView ? onOverlayMouseMove : () => {}}
    >
      <VideoOverlay // attach to grid container (if focus view)
        sid={focus}
        isFocusItem
        userName={focusUserName}
        isPopout={focusVideoItem?.isPopout}
        isLocal={focusVideoItem?.isLocal}
        sourceType={focusVideoItem?.videoTrack.source}
        hidden={!isFocusView || hideOverlay}
        setFocus={setFocus}
        setIsFocusView={setIsFocusView}
        setIsPopout={setIsPopout}
      />
      {gridItems}
    </Box>
  );
}

export default MainVideoView;
