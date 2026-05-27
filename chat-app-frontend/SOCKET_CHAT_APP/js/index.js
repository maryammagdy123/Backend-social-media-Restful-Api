const baseURL = "http://localhost:3000";

$("#login").click(() => {
  const email = $("#email").val();
  const password = $("#password").val();
  const data = {
    email,
    password,
  };
  axios({
    method: "post",
    url: `${baseURL}/auth/login`,
    data: data,
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  })
    .then(function (response) {
      const { message, data, success } = response.data;
      if (data.message === "Login successfully") {
        localStorage.setItem("token", data.data.accessToken);
        window.location.href = "chat.html";
      } else {
        alert("In-valid email or password");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
