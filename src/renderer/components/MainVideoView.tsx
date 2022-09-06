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
import useGridSize from '../hooks/useGridSize';
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

  // const gridRef = React.useRef(null);
  const [gridTarget, setGridTarget] = React.useState();
  const { columns, rows } = useGridSize(gridTarget);
  const rowPercentage = `${100 / (rows || 1)}%`;

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
        sx={{
          // TODO: Clean this up
          // borderRadius: '4px',
          // maxHeight: focus ? '100vh' : 'calc(90vh - 56px)',
          overflow: 'hidden',
          // For grid view, position controls relative to each video item
          // position: focus ? 'static' : 'relative',
          position: 'relative',
          height: '100%',
          width: '100%',
          maxHeight: `max(200px, calc(${rowPercentage}% - 16px - ${
            (rows ?? 1) * 16
          }px))`,
        }}
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
      sx={{
        backgroundColor: 'black',
        boxSizing: 'border-box',
        height: '100%',
        p: focus ? 0 : 2,
        overflowY: 'auto',
      }}
    >
      <Box sx={{ color: 'white' }}>
        {JSON.stringify({ columns, rows }, null, 2)}
      </Box>
      <Box
        ref={setGridTarget}
        className="main-video-view-grid"
        sx={{
          display: 'grid',
          gridGap: '16px',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          alignItems: 'center',
          height: '100%',
          overflow: 'hidden',
          // TODO: Clean this up
          // minHeight: '100%',
          // gridTemplateRows: 'repeat(auto-fit, minmax(200px, 1fr))',
          gridAutoRows: '1fr',
        }}
      >
        {gridItems}
      </Box>
    </Box>
  );
}

export default MainVideoView;
