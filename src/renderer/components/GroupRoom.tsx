/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import * as Livekit from 'livekit-client';
import {
  remove,
  update,
  child,
  get,
  ref,
  onValue,
  DataSnapshot,
} from 'firebase/database';
import * as React from 'react';
import * as models from '../models/models';
import RoomParticipants from './RoomParticipants';
import useRoom from '../hooks/useRoom';
import useCurrentRoom from '../hooks/useCurrentRoom';
import useConnection from '../hooks/useConnection';
import { ConnectionState } from '../contexts/ConnectionContext';
import useFirebase from '../hooks/useFirebase';
import useAppUser from '../hooks/useAppUser';

type ParticipantRTInfo = {
  isMuted: boolean;
  isDeafened: boolean;
  isCameraShare: boolean;
  isScreenShare: boolean;
};

export type RoomRTInfo = Map<string, ParticipantRTInfo>;

function useUserMap(users: models.RoomUserInfo[]) {
  const userMap = new Map<string, models.RoomUserInfo>();
  users.forEach((userinfo: models.RoomUserInfo) => {
    const { user_id: id } = userinfo;
    userMap.set(`${id}`, userinfo);
  });

  return userMap;
}

function GroupRoom(props: {
  groupinfo: models.GroupInfo;
  roominfo: models.RoomInfo;
}) {
  const { groupinfo, roominfo } = props;
  const { users } = roominfo;
  const userMap = useUserMap(users);
  const groupId = roominfo.room.group_id;
  const { id } = roominfo.room;
  const connectConfig: Livekit.ConnectOptions = {
    autoSubscribe: true,
    adaptiveStream: true,
    autoManageVideo: true,
    dynacast: true,
    audio: true,
    video: false,
  };
  const url = 'wss://demo.dally.app';
  const { connect, room } = useRoom();
  const { currentRoom, setCurrentRoom } = useCurrentRoom();
  const { connectionState } = useConnection();
  const { database } = useFirebase();
  const { appUser } = useAppUser();
  const roomRTRef = ref(database, `participants/${groupId}/${id}`);
  const [roomRTInfo, setRoomRTInfo] = React.useState<RoomRTInfo>(
    new Map<string, ParticipantRTInfo>()
  );

  React.useEffect(() => {
    console.log(`GroupRoom.useEffect for group ${groupId} room ${id}`);

    onValue(
      roomRTRef,
      (snapshot: DataSnapshot) => {
        console.log(
          `GroupRoom.onValue.Callback for group ${groupId} room ${id}`
        );
        console.log('snapshot.val()', snapshot.val());
        setRoomRTInfo(snapshot.val() as RoomRTInfo);
      },
      (error) => {
        console.log('onValue error', error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    const connectRoom = () => {
      // set current room to this room
      setCurrentRoom({
        roomId: roominfo.room.id,
        roomName: roominfo.room.name,
        groupId: roominfo.room.group_id,
        groupName: groupinfo.group.name,
      });
      // connect to room
      connect(url, roominfo.token, connectConfig)
        .then(() => {
          console.log(`connected to room ${roominfo.room.id}`, room);
          update(child(roomRTRef, `${appUser.id}`), {
            isMuted: false,
            isDeafened: false,
            isCameraShare: false,
            isScreenShare: false,
          });
          return true;
        })
        .catch(() => {
          return false;
        });
    };

    console.log(`clicked room ${roominfo.room.id}`, roominfo);
    console.log('roomRTInfo', roomRTInfo);

    // if changing rooms: disconnect first, then connect
    if (currentRoom.roomId !== roominfo.room.id) {
      if (room?.state) {
        if (room.state !== 'disconnected') {
          console.log(
            `disconnecting from room ${currentRoom.roomId} and connecting to room ${roominfo.room.id}`
          );
          room.disconnect();
          const nodeRef = ref(
            database,
            `participants/${currentRoom.groupId}/${currentRoom.roomId}/${appUser.id}`
          );
          console.log('removing RT node:', nodeRef);
          remove(nodeRef);
        }
      }
      connectRoom();

      // else clicked on same room. already connected?
      // if so, do nothing. otherwise, connect.
    } else if (connectionState === ConnectionState.Connected) {
      console.log(`already connected to room ${roominfo.room.id}`, room);
    } else {
      connectRoom();
    }
  };

  const showUsers = () => {
    if (
      currentRoom.roomId === roominfo.room.id &&
      connectionState === ConnectionState.Connected
    ) {
      return <RoomParticipants userMap={userMap} />;
    }
    return null; // TODO: <PeekParticipants users={users} />
  };

  return (
    <>
      <ListItemButton
        dense
        onClick={handleClick}
        component="li"
        sx={{ py: 0.5 }}
      >
        <ListItemIcon>
          <VolumeUpIcon sx={{ fontSize: 20 }} />
        </ListItemIcon>
        <ListItemText primary={roominfo.room.name} />
      </ListItemButton>
      {showUsers()}
    </>
  );
}

export default GroupRoom;
// todo: if connected to Room A in Group A, then connecting to Room A in Group B
// will not drop rt db entry from Room A in Group A.
