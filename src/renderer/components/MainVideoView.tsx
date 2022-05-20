/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import * as React from 'react';
import {
  RoomEvent,
  LocalParticipant,
  LocalTrackPublication,
  Track,
  RemoteTrackPublication,
  RemoteParticipant,
} from 'livekit-client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useRoom from '../hooks/useRoom';
import VideoItem from './VideoItem';

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
  setUpScreenTrack: (
    videoTrack: RemoteTrackPublication | LocalTrackPublication,
    participant: RemoteParticipant | LocalParticipant
  ) => void;
  takeDownScreenTrack: (
    videoTrack: RemoteTrackPublication | LocalTrackPublication,
    participant: RemoteParticipant | LocalParticipant
  ) => void;
  setIsPopout: (sid: string, isPopout: boolean) => void;
  videoItems: VideoItemsObject;
}

function MainVideoView(props: MainVideoViewProps) {
  const { setUpScreenTrack, takeDownScreenTrack, setIsPopout, videoItems } =
    props;
  const { room } = useRoom();
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

  const createSetFocusViewCallback = React.useCallback(
    (sid: string) => () => {
      console.log('got focus callback', sid);
      setFocus(sid);
      setIsFocusView(true);
    },
    [setFocus, setIsFocusView]
  );

  const handleVideoClickEvent = React.useCallback(
    (sid: string) =>
      (event: React.MouseEvent<HTMLVideoElement | HTMLElement>) => {
        console.log('handleClickEvent', event);
        const target = event.target as HTMLVideoElement | HTMLElement;
        if (target.localName === 'video') {
          setFocus(sid);
          setIsFocusView(true);
        }
      },
    []
  );

  const setGridViewCallback = React.useCallback(() => {
    setIsFocusView(false);
    setFocus('');
  }, []);

  const createSetIsPopoutCallback = React.useCallback(
    (sid: string) => (isPopout: boolean) => {
      setIsPopout(sid, isPopout);
    },
    [setIsPopout]
  );

  const escKeydownHandler = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setGridViewCallback();
      }
    },
    [setGridViewCallback]
  );

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

  const handleTrackPublished = React.useCallback(
    (track: RemoteTrackPublication, participant: RemoteParticipant) => {
      if (track.kind === 'video') {
        setUpScreenTrack(track, participant);
      }
    },
    [setUpScreenTrack]
  );

  const handleTrackUnpublished = React.useCallback(
    (track: RemoteTrackPublication, participant: RemoteParticipant) => {
      if (track.kind === 'video') {
        takeDownScreenTrack(track, participant);
      }
    },
    [takeDownScreenTrack]
  );

  const handleTrackUnsubscribed = React.useCallback(
    (
      _: Track,
      track: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      console.log(RoomEvent.TrackUnsubscribed, _, track, participant);
      if (track.kind === 'video') {
        takeDownScreenTrack(track, participant);
      }
    },
    [takeDownScreenTrack]
  );

  const handleLocalTrackUnpublished = React.useCallback(
    (track: LocalTrackPublication, participant: LocalParticipant) => {
      console.log(RoomEvent.LocalTrackUnpublished, track, participant);
      if (track.kind === 'video') {
        takeDownScreenTrack(track, participant);
      }
    },
    [takeDownScreenTrack]
  );

  React.useEffect(() => {
    if (room) {
      room.on(RoomEvent.TrackPublished, handleTrackPublished);
      room.on(RoomEvent.TrackUnpublished, handleTrackUnpublished);
      room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      room.on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);
      return () => {
        room.off(RoomEvent.TrackPublished, handleTrackPublished);
        room.off(RoomEvent.TrackUnpublished, handleTrackUnpublished);
        room.off(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
        room.off(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);
      };
    }
    return () => {};
  }, [
    handleTrackPublished,
    handleTrackUnpublished,
    handleTrackUnsubscribed,
    handleLocalTrackUnpublished,
    room,
  ]);

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

  const gridItems = Object.entries(videoItems)
    .filter(([_sid, videoItem]) => {
      return !videoItem.isPopout;
    })
    .map(([sid, videoItem]) => {
      const { userName, isPopout, isLocal, videoTrack } = videoItem;
      const isFocusItem = focus === sid;
      const sourceType = videoTrack.source;
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
            <VideoItem videoTrack={videoTrack} isLocal={isLocal} />
            <VideoOverlay
              isFocusItem={isFocusItem}
              userName={userName}
              isPopout={isPopout}
              isLocal={isLocal}
              sourceType={sourceType}
              hidden={isFocusView}
              setFocusViewCallback={createSetFocusViewCallback(sid)}
              setIsPopoutCallback={createSetIsPopoutCallback(sid)}
            />
          </Box>
        </Grid>
      );
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
        isFocusItem
        userName={focusVideoItem?.userName}
        isPopout={focusVideoItem?.isPopout}
        isLocal={focusVideoItem?.isLocal}
        sourceType={focusVideoItem?.videoTrack.source}
        hidden={!isFocusView || hideOverlay}
        setGridViewCallback={setGridViewCallback}
        setIsPopoutCallback={
          isFocusView ? createSetIsPopoutCallback(focus) : () => {}
        }
      />
      {gridItems}
    </Grid>
  );
}

export default MainVideoView;
