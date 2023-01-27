<template>
  <div class="grid">
    <div class="grid-col-1">
      <div class="register-form">
        <div class="heading">
          <p>REGISTER</p>
        </div>
        <form class="form" @submit.prevent="signIn">
          <input type="text" placeholder="Name" v-model="form.name" />
          <input type="email" placeholder="Email" v-model="form.email" />
          <input type="text" placeholder="PhoneNumber" v-model="form.phone" />
          <input
            type="password"
            placeholder="Password"
            v-model="form.password"
          />
          <button type="submit">SIGN UP</button>
          <p>
            Already have an account ?
            <router-link to="/login" style="color: #6c63ff">
              login
            </router-link>
          </p>
        </form>
      </div>
    </div>
    <div class="grid-col-2"></div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../assets/firebase";

export default {
  setup() {
    const form = ref({});
    const signIn = () => {
      addUser();
      register();
    };
    const addUser = () => {
      addDoc(collection(db, "users"), {
        name: form.value.name,
        email: form.value.email,

      });

    };
    const store = useStore();
    const register = () => {
      store.dispatch("register", form.value);
    };

    return {
      register,
      form,
      addUser,
      signIn,
    };
  },
};
</script>
<style scoped>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  font-family: "Inter", "Helvetica Neue", "Segoe UI", "Fira Sans", Roboto,
    Oxygen, Ubuntu, "Droid Sans", "Arial", sans-serif;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 100%;
  height: 100vh;
}
.grid-col-1 {
  position: relative;
  display: grid;
  place-items: center;
}
.grid-col-1 .heading {
  display: flex;
  justify-content: center;
  font-weight: bold;
  padding-top: 50px;
  font-size: large;
}
.grid-col-2 {
  background-image: url("../assets/p1.svg");
  background-position: center;
  background-size: 500px;
  background-repeat: no-repeat;
  background-color: rgb(225, 240, 243);
}
.heading {
  padding-bottom: 10px;
}
.register-form {
  background: rgb(225, 240, 243);
  width: 70%;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
form {
  display: grid;
  place-items: center;
  padding-bottom: 20px;
}

form > input {
  display: block;
  border-radius: 22px;
  padding: 10px;
  margin: 10px;
  width: 50%;
  border: 1px solid gray;
}
form > button {
  display: block;
  border-radius: 22px;
  padding: 10px;
  margin: 10px;
  width: 55%;
  background-color: #6c63ff;
  color: white;
  border: none;
}
form > p {
  padding: 10px;
}
@media (max-width: 1000px) {
  .grid {
    display: block;
    margin-top: 30px;
  }

  .grid-col-2 {
    display: none;
  }
}
@media (max-width: 700px) {
  form > input {
    width: 70%;
  }
  form > button {
    width: 75%;
  }
}
</style>
