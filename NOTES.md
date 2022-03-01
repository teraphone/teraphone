# install livekit client sdk
react lib repo [here](https://github.com/livekit/livekit-react).

install with:
  
  ```npm install --save livekit-react```

# install mui

Follow the instructions [here](https://mui.com/getting-started/installation/).

# UI elements

## Groups

Groups can use [vertical tabs](https://mui.com/components/tabs/#vertical-tabs).

# TODO:
- [x] save JWT on successful login/signup
- [x] on successful login/signup, redirect to /home
  - [x] request data from api server...
    - [x] get groups
    - [x] for each group
      - [x] get users, user roles
      - [x] get rooms
      - [x] for each room
        - [x] get user roles
  - [ ] UI elements
    - [ ] groups
      - [ ] current groups
      - [ ] group users
      - [ ] group invite
      - [ ] create group
    - [ ] rooms
      - [ ] current rooms
        - [ ] participants
        - [ ] join room
      - [ ] new room
    - [ ] details
      - [ ] group details
      - [ ] room details
      - [ ] user details
    - [ ] communication controls
      - [ ] mute/unmute
      - [ ] deafen/undeafen
      - [ ] disconnect





