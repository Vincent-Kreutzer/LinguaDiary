
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
let authData = {};//phpにデータを送る際に使うオブジェクト


/*====================================
=====モーダルの開閉、ボタンの非表示=====
======================================*/
 


//新規登録モーダル開閉（新規を開いたら、ログインは閉じる）
signupBtn.addEventListener("click", () => {
  signupModal.classList.remove("hidden");
  signupBtn.classList.add("active");

  signinModal.classList.add("hidden");
  signinBtn.classList.remove("active");
})

//ログインモーダル開閉（ログインを開いたら新規は閉じる）
signinBtn.addEventListener("click", () => {
  signinModal.classList.remove("hidden");
  signinBtn.classList.add("active");
  
  signupModal.classList.add("hidden");    
  signupBtn.classList.remove("active");
})


/*===================
=====新規登録関係=====
====================*/


//新規登録に伴うデータ送信関数
async function registerUser() {
  console.log("clicked register btn");
  
  //入力欄の値を取得
  authData = {
    username: signupUsername.value,
    email: signupEmail.value,
    password: signupPassword.value
  }

  //新規登録モードでバリデーション関数呼び出し、 入力欄の値を渡す
  const validatedData = validateAuth("register", authData);
  
  registerBtn.disabled = true;//登録ボタンをロックして多重送信を防ぐ
  if (validatedData) {
    try {
    const response = await fetch ("api/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(validatedData)
    })

    const data = await response.json();
    
    if (data.success) {
      alert("Your account has been created successfully.");
      //ユーザーidをセッションに保存し、ページ遷移させる      
      location.href = "main.html";
    } else {
      alert(data.message);
    }

    } catch (e) {
      console.log(e)
    } finally {
      registerBtn.disabled = false;
    }

  } else {
    registerBtn.disabled = false;
    return;
  }
  
}

registerBtn.addEventListener("click", registerUser);


/*===================
=====ログイン関係=====
====================*/

//ログインに伴うデータ送信
async function loginUser() {
  

  //入力欄の値を取得
  const authData = {
    email: signinEmail.value,
    password: signinPassword.value
  }

  //オブジェクト形式でバリデーションに成功したデータを受け取る
  const validatedData = validateAuth("login", authData);
  loginBtn.disabled = true;
  
  if (validatedData) {
    try {
      
      const response = await fetch("api/login.php", {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(validatedData)

      })

      const data = await response.json();
      console.log(data);
      if (data.success) {
        alert("Login successful.");
        location.href = "main.html";        
      } else {
        alert(data.message);
      }

    } catch (e) {
        console.log(e)
    } finally {
      loginBtn.disabled = false;
    }
  } else {
    loginBtn.disabled = false;
    return;
  }  
}

loginBtn.addEventListener("click", loginUser);


/*=====================
=====バリデーション=====
======================*/

//新規作成バリデーション
function validateAuth(mode, data) {
	if (mode === "register") {
    let validatedData = {};

    //新規登録情報のバリデーション
    const userName = data.username.trim();//送信用
    if (!(userName.length >= 3 && userName.length <= 20)) {
      alert("Username must be between 3 and 20 characters.");
      return null;
    }
        
    const email = data.email;//送信用
    if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+\.[a-zA-Z0-9_.-]+$/.test(email))) {
      alert("Please enter a valid email address.");
      return null;
    }
          
    const password = data.password;//送信用   
    if (!(password.length >= 8)) {
      alert("Password must be at least 8 characters long.");
      return null;

    } else if (!/^[a-zA-Z0-9_]+$/.test(password)) {
      alert("Password can only contain letters, numbers, and underscores (_).");
      return null;

    } else if (!/[a-zA-Z]/.test(password)) {
      alert("Password must include at least one letter.");
      return null;

    } else if (!/[0-9]/.test(password)) {
      alert("Password must include at least one number.");
      return null;
    }

    validatedData = {
      "username": userName,
      "email": email,
      "password": password
    }
    
    return validatedData;        

    //ログイン時のバリデーション
  } else {
      const email = data.email.trim();
      const validatedEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+\.[a-zA-Z0-9_.-]+$/.test(email);//検閲用

      const password = data.password;
      const validatedPassword = password.length > 0;

      const validatedData = {
        "email": email,
        "password": password
      }

      if (validatedEmail && validatedPassword) {
        return validatedData
      } else {
        alert("Invalid email or password.");
        return null;  
      }
  }    
}
