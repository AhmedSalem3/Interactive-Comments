async function fetchComments() {
  let response = await fetch("data.json");

  let data = await response.json();

  console.log(data);
  setContent(data);
  adminImg(data);
  eventListeners(data);
}

fetchComments();

function adminImg({ currentUser } = data) {
  const allUserImages = document.querySelectorAll("img.current-user");

  allUserImages.forEach((image) => (image.src = currentUser.image.webp));
}

function setContent(data) {
  let {
    comments,
    currentUser: { username, image: adminImages },
  } = data;

  comments.forEach((comment) => {
    displayComment(comment, username, adminImages);
  });
}

function displayComment(dataComment, adminName, adminImages) {
  const allcommentsHolder = document.querySelector(".all-comments");

  const {
    content,
    createdAt: timeCreated,
    id,
    score,
    user: { image, username },
    replies,
  } = dataComment;

  // creating the wrapper
  let commentWrapper = document.createElement("div");
  commentWrapper.className = "comment-wrapper";
  commentWrapper.id = id;

  // creating the comment itself
  let comment = document.createElement("div");
  comment.setAttribute("id", id);
  comment.className = "comment";

  // creating counter in the comment

  creatingCounter(comment, score);

  // creating comment info & text
  let commentContent = document.createElement("div");
  commentContent.className = "comment-content";

  let commentHeader = document.createElement("div");
  commentHeader.className = "post-info";

  owner(commentHeader, username, image.webp);

  let isAdmin = false;
  if (adminName == username) {
    isAdmin = true;
  }
  adminTag(commentHeader, isAdmin);

  timestamp(commentHeader, timeCreated);

  actions(commentHeader, isAdmin, id);

  commentContent.appendChild(commentHeader);

  text(content, commentContent);
  // appending
  comment.appendChild(commentContent);

  commentWrapper.appendChild(comment);

  addingReplies(replies, commentWrapper, adminName, id, adminImages);

  // appending all elements
  allcommentsHolder.appendChild(commentWrapper);
}

// all functions for styles (useable)

function creatingCounter(appender, score) {
  let counterHolder = document.createElement("div");
  counterHolder.className = "counter-holder";
  let counter = document.createElement("div");
  counter.className = "counter";
  let counterUp = document.createElement("span");
  counterUp.setAttribute("class", "counter-up counter-control");
  counterUp.appendChild(document.createTextNode("+"));
  counter.appendChild(counterUp);
  let counterNumber = document.createElement("span");
  counterNumber.className = "counter-number";
  counterNumber.appendChild(document.createTextNode(score));
  counter.appendChild(counterNumber);
  let counterDown = document.createElement("span");
  counterDown.setAttribute("class", "counter-down counter-control");
  counterDown.appendChild(document.createTextNode("-"));
  counter.appendChild(counterDown);
  counterHolder.appendChild(counter);

  // appending
  appender.appendChild(counterHolder);
}

function owner(appender, username, image) {
  let commentOwner = document.createElement("div");
  commentOwner.className = "user-info";

  let img = document.createElement("img");
  img.className = "user-photo";
  img.src = image;
  commentOwner.appendChild(img);

  let user = document.createElement("div");
  user.className = "user-name";
  user.appendChild(document.createTextNode(username));
  commentOwner.appendChild(user);

  appender.appendChild(commentOwner);
}

function timestamp(appender, timeCreated) {
  let timestamp = document.createElement("div");
  timestamp.className = "timestamp";
  timestamp.appendChild(document.createTextNode(timeCreated));
  appender.appendChild(timestamp);
}

function adminTag(appender, isAdmin) {
  if (isAdmin) {
    let tag = document.createElement("span");
    tag.className = "tag";
    tag.appendChild(document.createTextNode("You"));
    appender.appendChild(tag);
  }
}

function actions(appender, admin, postId) {
  let images = {
    reply: "images/icon-reply.svg",
    edit: "images/icon-edit.svg",
    delete: "images/icon-delete.svg",
  };
  let actions = document.createElement("div");
  actions.className = "actions";
  actions.dataset.id = postId;

  function addActionBtn(actionParent, IconName, iconImage) {
    let iconHolder = document.createElement("span");
    iconHolder.className = `${IconName}-btn`;
    iconHolder.innerHTML = `
   <img src="${iconImage}" alt="icon">
   ${IconName}
   `;
    actionParent.appendChild(iconHolder);
  }

  if (admin) {
    addActionBtn(actions, "edit", images.edit);
    addActionBtn(actions, "delete", images.delete);
  } else {
    addActionBtn(actions, "reply", images.reply);
  }

  appender.appendChild(actions);
}

function text(content, commentContent, replyingTo = "") {
  let commentText = document.createElement("p");
  commentText.setAttribute("class", "comment-text text");
  commentText.innerHTML = `<span class="comment-user-tag">${replyingTo}</span> ${content}`;
  commentContent.appendChild(commentText);
}

function replyTemplate(appender, postId, adminName, adminImages) {
  let reply = document.querySelector(".admin-add.add-comment").cloneNode(true);
  reply.classList.remove("add-comment");
  reply.classList.add("reply-inputs");
  reply.classList.add("hidden");
  let replyInput = reply.querySelector("textarea");
  reply.querySelector("input[type='submit']").setAttribute("value", "Reply");

  reply.addEventListener("submit", newReply);

  function newReply(e) {
    e.preventDefault();
    if (replyInput.value == "") return;
    let comments = document.querySelectorAll(".comment-wrapper");
    console.log(adminName);

    comments.forEach((comment) => {
      if (comment.id == postId) {
        let repliesHolder = comment.querySelector(".replies-holder");

        const replyObj = {
          content: replyInput.value,
          createdAt: "Just Now",
          replyingTo: "user",
          score: 0,
          user: {
            image: {
              png: adminImages.png,
              webp: adminImages.webp,
            },
            username: adminName,
          },
        };

        appendReply(replyObj, repliesHolder, "ramsesmiron", postId);
        replyInput.value = "";
      }
    });
  }

  appender.prepend(reply);
}

// function for adding replies to any comment
// adding replies
function addingReplies(
  dataReplies,
  commentWrapper,
  adminName,
  postId,
  adminImages
) {
  let repliesHolder = document.createElement("div");
  repliesHolder.className = "replies-holder";

  dataReplies.forEach((reply) => {
    appendReply(reply, repliesHolder, adminName, postId);
  });

  replyTemplate(repliesHolder, postId, adminName, adminImages);
  commentWrapper.appendChild(repliesHolder);
}
//
//
function appendReply(dataReply, repliesHolder, adminName, postId) {
  let {
    content,
    createdAt: timeCreated,
    replyingTo,
    score,
    user: { image, username },
    id,
  } = dataReply;

  replyingTo = `@${replyingTo}`;

  let reply = document.createElement("div");
  reply.className = "reply";
  reply.setAttribute("id", id);
  creatingCounter(reply, score);

  // creating comment info & text
  let replyContent = document.createElement("div");
  replyContent.className = "reply-content";

  let replyHeader = document.createElement("div");
  replyHeader.className = "post-info";

  let isAdmin = false;
  if (adminName == username) {
    isAdmin = true;
  }

  owner(replyHeader, username, image.webp);
  adminTag(replyHeader, isAdmin);
  timestamp(replyHeader, timeCreated);
  actions(replyHeader, isAdmin, postId);

  replyContent.appendChild(replyHeader);

  text(content, replyContent, replyingTo);

  reply.appendChild(replyContent);
  repliesHolder.appendChild(reply);

  // commentWrapper.appendChild(repliesHolder);
}
//
//
function eventListeners({ currentUser } = data) {
  const adminForm = document.querySelector(".admin-add.add-comment form");
  const adminInput = document.querySelector(".admin-add.add-comment textarea");

  adminForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (adminInput.value == "") return;
    addAdminComment(currentUser);
  });
  function addAdminComment(adminInfo) {
    const {
      image: { webp: imageWebp, png: imagePng },
      username: adminName,
    } = adminInfo;

    let commentObj = {
      id: 2,
      content: adminInput.value,
      createdAt: `Just Now`,
      score: 0,
      user: {
        image: {
          png: imagePng,
          webp: imageWebp,
        },
        username: adminName,
      },
      replies: [],
    };
    displayComment(commentObj, adminName);
    adminInput.value = "";

    window.scrollTo({
      left: 0,
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }
  //
  document.addEventListener("click", showReplyInput);
  function showReplyInput(e) {
    if (!e.target.classList.contains("reply-btn")) return;
    let postId = e.target.parentElement.dataset.id;
    let comments = document.querySelectorAll(".comment-wrapper");

    comments.forEach((comment) => {
      if (comment.getAttribute("id") == postId) {
        comment
          .querySelector(".replies-holder .admin-add.reply-inputs")
          .classList.toggle("hidden");
      }
    });
  }
  //
  document.addEventListener("click", rateCounter);

  function rateCounter(e) {
    let rated = false;
    if (!e.target.classList.contains("counter-control")) return;

    let counterHolder = e.target.parentElement;
    let counterNumber = e.target.parentElement.querySelector(".counter-number");

    if (e.target.classList.contains("counter-up") && rated == false) {
      counterNumber.innerHTML = +counterNumber.innerHTML + 1;
      rated = true;
      counterHolder.classList.remove("disliked");
      counterHolder.classList.add("liked");
    } else if (e.target.classList.contains("counter-down") && rated == false) {
      counterNumber.innerHTML = +counterNumber.innerHTML - 1;
      rated = true;
      counterHolder.classList.remove("liked");
      counterHolder.classList.add("disliked");
    }
  }
}
