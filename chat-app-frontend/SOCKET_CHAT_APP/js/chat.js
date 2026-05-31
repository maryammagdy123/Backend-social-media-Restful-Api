const baseURL = "http://localhost:3000";
//images links
let avatar = "./avatar/Avatar-No-Background.png";
let meImage = "./avatar/Avatar-No-Background.png";
let friendImage = "./avatar/Avatar-No-Background.png";

const token = localStorage.getItem("token");
const bearerToken = `${token}`;
let globalProfile = {};
const headers = {
  "Content-Type": "application/json; charset=UTF-8",
  authorization: bearerToken,
};
const socket = io(baseURL, {
  auth: { token },
}); // socket call method [connect] >> emit event connection to the backend

socket.on("likePost", (data) => {
  console.log({ likePost: data });
});

socket.on("connect_error", (err) => {
  console.log("connect_error:", err.message);
});

socket.on("custom_error", (err) => {
  console.log("custom_error:", err.message);
});

socket.emit("sayHi", { name: "FROM FE TO BE" }, (response) => {
  console.log({ response });
});
socket.on("offline_user", (data) => {
  console.log({ data });
});

// // // collect messageInfo
function sendMessage(sendTo, type) {
  console.log({ sendTo, type });

  if (type == "ovo") {
    const data = {
      content: $("#messageBody").val(),
      sendTo,
    };
    console.log({ data });

    socket.emit("sendMessage", data);
  } else if (type == "group") {
    const data = {
      content: $("#messageBody").val(),
      groupId: sendTo,
    };
    socket.emit("sendGroupMessage", data);
  }
}

// // // // // //sendCompleted
socket.on("successMessage", (data) => {
  const onclickAttr = document
    .getElementById("sendMessage")
    .getAttribute("onclick");
  const [base, currentOpenedChat] =
    onclickAttr?.match(/sendMessage\('([^']+)'/) || [];

  const { content, sendTo } = data;
  console.log({ sendTo, currentOpenedChat });

  if (sendTo == currentOpenedChat) {
    const div = document.createElement("div");

    div.className = "me text-end p-2";
    div.dir = "rtl";
    const imagePath = globalProfile.profilePicture
      ? `${baseURL}/uploads/${globalProfile.profilePicture}`
      : avatar;
    div.innerHTML = `
    <img class="chatImage" src="${imagePath}" alt="" srcset="">
    <span class="mx-2">${content}</span>
    `;
    document.getElementById("messageList").appendChild(div);
    $(".noResult").hide();
    $("#messageBody").val("");
  }
});

// // // // // // // // // //receiveMessage
socket.on("newMessage", (data) => {
  console.log({ RM: data });
  const { content, from, groupId } = data;
  console.log({ from });

  let imagePath = avatar;
  if (from?.profilePicture) {
    imagePath = `${baseURL}/uploads/${from.profilePicture}`;
  }
  const onclickAttr = document
    .getElementById("sendMessage")
    .getAttribute("onclick");
  const [base, currentOpenedChat] =
    onclickAttr?.match(/sendMessage\('([^']+)'/) || [];
  console.log({ currentOpenedChat });
  console.log({ onclickAttr, currentOpenedChat });

  if (
    (!groupId && currentOpenedChat === from._id) ||
    (groupId && currentOpenedChat === groupId)
  ) {
    if (from?._id.toString() != globalProfile._id.toString()) {
      const div = document.createElement("div");
      div.className = "myFriend p-2";
      div.dir = "ltr";
      div.innerHTML = `
    <img class="chatImage" src="${imagePath}" alt="" srcset="">
    <span class="mx-2">${content}</span>
    `;
      document.getElementById("messageList").appendChild(div);
    }
  } else {
    if (groupId) {
      $(`#g_${groupId}`).show();
    } else {
      $(`#c_${from._id}`).show();
    }
    const audio = document.getElementById("notifyTone");
    audio.currentTime = 0; // restart from beginning
    audio.play().catch((err) => console.log("Audio play blocked:", err));
  }
});

// // // ******************************************************************** Show chat conversation
function showData(sendTo, chat) {
  document
    .getElementById("sendMessage")
    .setAttribute("onclick", `sendMessage('${sendTo}' , "ovo")`);

  document.getElementById("messageList").innerHTML = "";
  if (chat?.messages?.length) {
    $(".noResult").hide();
    for (const message of chat.messages) {
      if (message.sender.toString() == globalProfile._id.toString()) {
        const div = document.createElement("div");
        div.className = "me text-end p-2";
        div.dir = "rtl";
        div.innerHTML = `
                <img class="chatImage" src="${meImage}" alt="" srcset="">
                <span class="mx-2">${message.content}</span>
                `;
        document.getElementById("messageList").appendChild(div);
      } else {
        const div = document.createElement("div");
        div.className = "myFriend p-2";
        div.dir = "ltr";
        div.innerHTML = `
                <img class="chatImage" src="${friendImage}" alt="" srcset="">
                <span class="mx-2">${message.content}</span>
                `;
        document.getElementById("messageList").appendChild(div);
      }
    }
  } else {
    const div = document.createElement("div");

    div.className = "noResult text-center  p-2";
    div.dir = "ltr";
    div.innerHTML = `
        <span class="mx-2">Say Hi to start the conversation.</span>
        `;
    document.getElementById("messageList").appendChild(div);
  }

  $(`#c_${sendTo}`).hide();
}

// // // // // // // // //get chat conversation between 2 users and pass it to ShowData fun
function displayChatUser(friendId) {
  axios({
    method: "get",
    url: `${baseURL}/chat/${friendId}`,
    headers,
  })
.then(function (response) {
  const { chat, messages } = response.data.data;

  const currentChat = chat[0];

  console.log(currentChat);

  const currentUser = currentChat.participants.find(
    (user) =>
      user._id.toString() === globalProfile._id.toString()
  );

  const friend = currentChat.participants.find(
    (user) =>
      user._id.toString() !== globalProfile._id.toString()
  );

  meImage = currentUser?.profilePicture
    ? `${baseURL}/uploads/${currentUser.profilePicture}`
    : avatar;

  friendImage = friend?.profilePicture
    ? `${baseURL}/uploads/${friend.profilePicture}`
    : avatar;

  currentChat.messages = messages;

  showData(friendId, currentChat);
})
    .catch(function (error) {
      console.log(error);

      if (error.response?.status === 404) {
        showData(friendId, 0);
      } else {
        alert("Ops something went wrong");
      }
    });
}

// // // // ********************************************************************
// // // // // ******************************************************************** Show  group chat conversation
function showGroupData(sendTo, chat) {
  document
    .getElementById("sendMessage")
    .setAttribute("onclick", `sendMessage('${sendTo}' , "group")`);

  document.getElementById("messageList").innerHTML = "";
  if (chat.messages?.length) {
    $(".noResult").hide();
    console.log(chat.messages);

    for (const message of chat.messages) {
      if (message.createdBy?._id?.toString() == globalProfile._id?.toString()) {
        const div = document.createElement("div");
        div.className = "me text-end p-2";
        div.dir = "rtl";
        div.innerHTML = `
                <img class="chatImage" src="${meImage}" alt="" srcset="">
                <span class="mx-2">${message.content}</span>
                `;
        document.getElementById("messageList").appendChild(div);
      } else {
        const div = document.createElement("div");
        div.className = "myFriend p-2";
        div.dir = "ltr";
        const friendImage = message.createdBy.profilePicture
          ? `${baseURL}/uploads/${message.createdBy.profilePicture}`
          : avatar;
        div.innerHTML = `
                <img class="chatImage" src="${friendImage}" alt="" srcset="">
                <span class="mx-2">${message.content}</span>
                `;
        document.getElementById("messageList").appendChild(div);
      }
    }
  } else {
    const div = document.createElement("div");

    div.className = "noResult text-center  p-2";
    div.dir = "ltr";
    div.innerHTML = `
        <span class="mx-2">Say Hi to start the conversation.</span>
        `;
    document.getElementById("messageList").appendChild(div);
  }
  $(`#g_${sendTo}`).hide();
}
// // // // // // // ********************************************************************
function displayGroupChat(groupId) {
  console.log({ groupId });
  axios({
    method: "get",
    url: `${baseURL}/chat/group/${groupId}`,
    headers,
  })
    .then(function (response) {
      const { chat } = response.data?.data;
      console.log({ chat });
      if (chat) {
        meImage = globalProfile.profilePicture
          ? `${baseURL}/uploads/${globalProfile.profilePicture}`
          : avatar;
        showGroupData(groupId, chat);
      } else {
        showGroupData(groupId, 0);
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log({ status: error.status });
      if (error.status) {
        showGroupData(groupId, 0);
      } else {
        alert("Ops something went wrong");
      }
    });
}
// // // // ==============================================================================================

// // ********************************************************* Show Users list
// Display Users
function getUserData() {
  axios({
    method: "get",
    url: `${baseURL}/user/me/profile`,
    headers,
  })
    .then(function (response) {
      console.log(response)
      const { userProfile, groups, friends } = response.data?.data;
      globalProfile = userProfile;
      let imagePath = avatar;
      if (userProfile.profilePicture) {
        imagePath = `${baseURL}/uploads/${userProfile.profilePicture}`;
      }
      document.getElementById("profileImage").src = imagePath;
      document.getElementById("userName").innerHTML = `${userProfile.username}`;
      showUsersData(friends, userProfile.username);
      showGroupList(groups);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// Show friends list
function showUsersData(friends = []) {
  let cartonna = ``;

  for (let i = 0; i < friends.length; i++) {
    let imagePath = avatar;

    if (friends[i].profilePicture) {
      imagePath = `${baseURL}/uploads/${friends[i].profilePicture}`;
    }

    cartonna += `
      <div onclick="displayChatUser('${friends[i]._id}')" class="chatUser my-2">

        <img class="chatImage" src="${imagePath}" alt="">

        <span class="ps-2">
          ${friends[i].username}
        </span>

        <span id="c_${friends[i]._id}" class="ps-2 closeSpan">
          🟢
        </span>

      </div>
    `;
  }

  document.getElementById("chatUsers").innerHTML = cartonna;
}

// // // // // Show groups list
function showGroupList(groups = []) {
  let cartonna = ``;
  for (let i = 0; i < groups.length; i++) {
    let imagePath = avatar;
    if (groups[i].group_image) {
      imagePath = `${baseURL}/uploads/${groups[i].group_image}`;
    }
    cartonna += `
        <div onclick="displayGroupChat('${groups[i]._id}')" class="chatUser my-2">
        <img class="chatImage" src="${imagePath}" alt="" srcset="">
        <span class="ps-2">${groups[i].group}</span>
           <span id="${"g_" + groups[i]._id}" class="ps-2 closeSpan">
           🟢
        </span>
    </div>

        `;
    socket.emit("join_room", { roomId: groups[i].roomId });
  }

  document.getElementById("chatGroups").innerHTML = cartonna;
}
getUserData();
