<template>
  <div class="grid">
    <div class="grid-col-1">
      <div class="register-form">
        <div class="heading">
          <p>LOGIN</p>
        </div>
        <form class="form" @submit.prevent="login">
          <input type="email" placeholder="Email" v-model="form.email" />

          <input type="password" placeholder="Password" v-model="form.password" />

          <button type="submit">LOGIN</button>
          <p>
            Don't  have an account ?
            <router-link to="/" style="color: #6c63ff">
              Register
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
import { ref , onBeforeMount } from "vue";
export default {
  setup() {
    const form = ref({});
    const store = useStore();
    const login = () => {
      store.dispatch('login', form.value)
    }
    onBeforeMount(()=> {
      store.dispatch('fetchUser')
    })

    return {
      login,
      form
    }
  },
};
</script>
<style scoped>
* {
  margin: 0px;
  padding: 0px;
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
}

form > input {
  display: block;
  border-radius: 22px;
  padding: 10px;
  margin: 10px;
  width: 50%;
  border: none;
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
  .grid{
    display: block;
     margin-top: 30px;
  }

  .grid-col-2{
    display: none;
  } }
</style>
