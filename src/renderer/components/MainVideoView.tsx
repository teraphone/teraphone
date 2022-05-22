/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import * as React from 'react';
import {
  LocalTrackPublication,
  RemoteTrackPublication,
  Track,
} from 'livekit-client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import VideoItem from './VideoItem';
import VideoItemPlaceholder from './VideoItemPlaceholder';
import { ChildWindowContext } from './WindowPortal';
import VideoOverlay from './VideoOverlay';
import useHideOnMouseStop from '../hooks/useHideOnMouseStop';

export type VideoItemValue = {
  userName: string;
  isPopout: boolean;
  isLocal: boolean;
  videoTrack: LocalTrackPublication | RemoteTrackPublication;
};

export type VideoItemsObject = {
  [sid: string]: VideoItemValue;
};

export interface MainVideoViewProps {
  setIsPopout: (sid: string, isPopout: boolean) => void;
  videoItems: VideoItemsObject;
}

function MainVideoView(props: MainVideoViewProps) {
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

  React.useEffect(() => {
    if (focus !== '' && !videoItems[focus]) {
      setIsFocusView(false);
      setFocus('');
    }
  }, [focus, videoItems]);

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
    if (thisWindow) {
      thisWindow.addEventListener('keydown', escKeydownHandler);
    }
    return () => {
      if (thisWindow) {
        thisWindow.removeEventListener('keydown', escKeydownHandler);
      }
    };
  }, [escKeydownHandler, thisWindow]);

  React.useEffect(() => {
    console.log('MainVideoView Mounted');
    return () => {
      console.log('MainVideoView Unmounted');
    };
  }, []);

  const gridBoxStyle: React.CSSProperties = {
    background: 'black',
    height: '400px',
    width: '500px',
    minWidth: '400px',
    position: 'relative',
  };

  const gridBoxFocusStyle: React.CSSProperties = {
    background: 'black',
    boxSizing: 'border-box',
    maxHeight: '100%',
    maxWidth: '100%',
    padding: '0px',
    position: 'relative',
  };

  const gridItemFocusStyle: React.CSSProperties = {
    padding: '0px',
  };

  const gridStyle: React.CSSProperties = {
    justifyContent: 'center',
    position: 'relative',
  };

  const gridFocusStyle: React.CSSProperties = {
    justifyContent: 'center',
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    margin: '0px',
    position: 'relative',
  };

  const focusVideoItem = videoItems[focus];

  const gridItems = Object.entries(videoItems).map(([sid, videoItem]) => {
    const { userName, isPopout, isLocal, videoTrack } = videoItem;
    if (videoTrack) {
      const isFocusItem = focus === sid;
      const sourceType = videoTrack.source;
      const isScreen = sourceType === Track.Source.ScreenShare;
      const sourceNameLocal = `Your ${isScreen ? 'Screen' : 'Camera'}`;
      const sourceNameRemote = `${userName}'s ${
        isScreen ? 'Screen' : 'Camera'
      }`;
      const sourceName = isLocal ? sourceNameLocal : sourceNameRemote;
      const placeholderMessage = `${sourceName} is playing in a popout window`;
      return (
        <Grid
          item
          key={sid}
          hidden={isFocusView && !isFocusItem}
          style={isFocusItem ? gridItemFocusStyle : {}}
        >
          <Box
            style={isFocusItem ? gridBoxFocusStyle : gridBoxStyle}
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
        </Grid>
      );
    }
    return null;
  });

  return (
    <Grid
      container
      spacing={1}
      style={isFocusView ? gridFocusStyle : gridStyle}
      onMouseEnter={isFocusView ? onOverlayMouseEnter : () => {}}
      onMouseLeave={isFocusView ? onOverlayMouseLeave : () => {}}
      onMouseMove={isFocusView ? onOverlayMouseMove : () => {}}
    >
      <VideoOverlay // attach to grid container (if focus view)
        sid={focus}
        isFocusItem
        userName={focusVideoItem?.userName}
        isPopout={focusVideoItem?.isPopout}
        isLocal={focusVideoItem?.isLocal}
        sourceType={focusVideoItem?.videoTrack.source}
        hidden={!isFocusView || hideOverlay}
        setFocus={setFocus}
        setIsFocusView={setIsFocusView}
        setIsPopout={setIsPopout}
      />
      {gridItems}
    </Grid>
  );
}

export default React.memo(MainVideoView);
