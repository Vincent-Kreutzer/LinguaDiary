
//DOM取得
const signupBtn = document.querySelector(".signup-btn");
const signinBtn = document.querySelector(".signin-btn");

const signupModal = document.querySelector(".signup-modal");
const signupUsername = document.querySelector(".signup-username");
const signupEmail = document.querySelector(".signup-email");
const signupPassword = document.querySelector(".signup-password");
const registerBtn = document.querySelector(".register-btn");

const signinModal = document.querySelector(".signin-modal");
const signinEmail = document.querySelector(".signin-email");
const signinPassword = document.querySelector(".signin-password");
const loginBtn = document.querySelector(".login-btn");
const cancelBtn = document.querySelectorAll(".cancel-btn");
let authData = {};//phpにデータを送る際に使うオブジェクト


/*=====================
=====モーダルの開閉=====
======================*/
 


//新規登録モーダル開閉（新規を開いたら、ログインは閉じる）
signupBtn.addEventListener("click", () => {
  signupModal.classList.toggle("hidden");
  signinModal.classList.add("hidden");
})


//ログインモーダル開閉（ログインを開いたら新規は閉じる）
signinBtn.addEventListener("click", () => {
  signinModal.classList.toggle("hidden");
  signupModal.classList.add("hidden");
})

//キャンセルボタンを押したらそのモーダルを閉じる
cancelBtn.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.currentTarget.closest(".modal").classList.add("hidden");
  })
})

/*===================
=====新規登録関係=====
====================*/


//新規登録に伴うデータ送信関数
async function registerUser() {
  console.log("clicked register btn");
  authData = {
    username: signupUsername.value,
    email: signupEmail.value,
    password: signupPassword.value
  }

  try {
    const response = await fetch ("api/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(authData)
    })

    const data = await response.json();

    if (data.success) {
      alert("Your account has been created successfully.");
      //ユーザーidをセッションに保存し、ページ遷移させる      
      location.href = "main.html";
    }

  } catch (e) {
    console.log(e)
  }
}

registerBtn.addEventListener("click", registerUser);



/*===================
=====ログイン関係=====
====================*/



//ログインに伴うデータ送信
async function loginUser() {
  authData = {
    email: signinEmail.value,
    password: signinPassword.value
  }

  try {
    const response = await fetch("api/login.php", {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(authData),      
    })

    const data = await response.json();
    if (data.success) {
      alert("Login successful.");
      location.href = "main.html";
    }

  } catch (e) {
    console.log(e)
  }
}

loginBtn.addEventListener("click", loginUser);