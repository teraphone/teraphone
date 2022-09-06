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
import useSize from '../hooks/useSize';
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
  const windowRef = React.useContext(ChildWindowContext);
  const thisWindow = windowRef.current;

  const { height, refCallback: viewRefCallback } = useSize();
  const { rows, refCallback: gridRefCallback } = useSize(
    Object.entries(videoItems).length
  );
  const rowHeight = `${
    ((height ?? 500) - ((rows || 1) + 1) * 16) / (rows || 1)
  }px`;

  const [
    hideOverlay,
    onOverlayMouseEnter,
    onOverlayMouseLeave,
    onOverlayMouseMove,
  ] = useHideOnMouseStop({
    delay: 2000,
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
      setFocus('');
    }
  }, [focus, isMounted, videoItems]);

  const handleVideoClickEvent = React.useCallback(
    (sid: string) =>
      (event: React.MouseEvent<HTMLVideoElement | HTMLElement>) => {
        const target = event.target as HTMLVideoElement | HTMLElement;
        if (target.localName === 'video') {
          setFocus(sid);
        }
      },
    []
  );

  const escKeydownHandler = React.useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
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

    if (focus && !isFocusItem) return null;

    return (
      <Box
        className="main-video-view-grid-item"
        sx={
          focus
            ? {
                backgroundColor: 'black',
                bottom: 0,
                height: '100%',
                left: 0,
                minHeight: '150px',
                minWidth: '150px',
                overflow: 'hidden',
                position: 'absolute',
                right: 0,
                top: 0,
                width: '100%',
                zIndex: 2,
              }
            : {
                height: '100%',
                maxHeight: `max(150px, ${rowHeight})`,
                minHeight: '150px',
                minWidth: '150px',
                overflow: 'hidden',
                position: 'relative',
                width: '100%',
              }
        }
        key={sid}
      >
        <Box
          onClick={handleVideoClickEvent(sid)}
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            // maxHeight: 'inherit',
            height: '100%',
          }}
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
                hidden={Boolean(focus) && hideOverlay}
                sid={sid}
                isFocusItem={isFocusItem}
                userName={userName}
                isPopout={isPopout}
                isLocal={isLocal}
                sourceType={sourceType}
                setFocus={setFocus}
                setIsPopout={setIsPopout}
              />
            </>
          )}
        </Box>
      </Box>
    );
  });

  const handleClose = React.useCallback(() => {
    dispatch(setWindowOpen(false));
  }, [dispatch]);

  const isEmpty = Object.keys(videoItems).length === 0;
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
      className="main-video-view"
      onMouseEnter={focus ? onOverlayMouseEnter : () => {}}
      onMouseLeave={focus ? onOverlayMouseLeave : () => {}}
      onMouseMove={focus ? onOverlayMouseMove : () => {}}
      ref={viewRefCallback}
      sx={{
        backgroundColor: 'black',
        height: '100%',
        p: focus ? 0 : 2,
        overflowY: 'auto',
      }}
    >
      <Box
        className="main-video-view-grid"
        ref={gridRefCallback}
        sx={{
          display: 'grid',
          gridGap: '16px',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
          alignItems: 'center',
          minHeight: '100%',
          gridAutoRows: '1fr',
        }}
      >
        {gridItems}
      </Box>
    </Box>
  );
}

export default MainVideoView;
