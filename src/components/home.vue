<template>
  <nav>
    <div class="menu">
      <p>Dashboard</p>
    </div>
    <div class="nav-right">
      <div class="profile">
        <!-- <div class="profile_heading">Profile</div> -->
        <Avatar
          icon="pi pi-user"
          size="small"
          v-badge="1"
          shape="circle"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        />

        <p class="name">{{ user.email }}</p>
      </div>
      <div     @click="toggle"
        aria-haspopup="true"
        aria-controls="overlay_menu">
      <i
    
        data-feather="menu"
        class="menu-icon"
      ></i>
      </div>
        <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
    </div>
  </nav>

  <div class="dashboard">
    <div class="profile_section">
      <div class="next_of_kin">
        <div class="_heading">
          <p>Next of Kin Details</p>
          <Button
            @click.prevent="showModal"
            icon="pi pi-plus"
            class="p-button-rounded showModalButton"
          />
        </div>

        <div v-for="doc in slicedDocs" :key="doc.id" class="next_of_kin_list">
          <Avatar
            image="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
            class="mr-2"
            size="  large"
            shape="circle"
          />
          <div>
            <div class="next_of_kin_name">{{ doc.name }}</div>
            <div class="next_of_kin_email">{{ doc.email }}</div>
          </div>
          <div>
            <Button
              @click.prevent="showEditModal(doc)"
              icon="pi pi-user-edit"
              class="p-button-rounded p-button-success doc-edit p-button-text"
            />
            <Button
              @click.prevent="confirm1(doc.id)"
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger doc-edit p-button-text"
            />

            <!-- <Button
              @click="deleteUser()"
              icon="pi pi-check"
              label="Confirm"
            ></Button> -->
          </div>
        </div>
      </div>
      <div class="link" v-if="slicedDocs.length">
        <Button
          icon="pi pi-arrow-right"
          class="p-button-rounded p-button-secondary doc-edit p-button-text"
        />
        <router-link to="/list"> <p>View full list</p></router-link>
      </div>
      <!-- <div class="logout">
        <Button label="logout" class="p-button-raised" @click="logout" />
      </div> -->
      <div></div>
    </div>
    <div class="stats_section">
      <div class="heart_rate_graph">
        <div id="mychart"></div>
      </div>
      <div class="rate_details">
        <!-- <div id="mychart"></div> -->
      </div>
    </div>
  </div>
  <Dialog v-model:visible="display" :modal="true" :draggable="false">
    <template #header class="modalHeader">
      <h5>Add New Next of Kin</h5>
    </template>
    <div class="modal-content">
      <div>
        <InputText
          type="text"
          v-model="newDocName"
          class="p-inputtext-sm"
          placeholder="Name"
        />
      </div>
      <div>
        <InputText
          type="text"
          v-model="newDocEmail"
          class="p-inputtext-sm"
          placeholder="Email"
        />
      </div>
      <div>
        <InputText
          type="text"
          class="p-inputtext-sm"
          placeholder="PhoneNumber"
          v-model="newDocPhone"
        />
      </div>
    </div>
    <template #footer class="modal-footer">
      <Button label="save" class="p-button-raised" @click="addNewDocument" />
    </template>
  </Dialog>
  <Dialog v-model:visible="displayEdit" :modal="true" :draggable="false">
    <template #header class="modalHeader">
      <h5>Edit Next of Kin</h5>
    </template>
    <div class="modal-content">
      <div>
        <InputText
          type="text"
          v-model="newDocName"
          class="p-inputtext-sm"
          placeholder="Name"
        />
      </div>
      <div>
        <InputText
          type="text"
          v-model="newDocEmail"
          class="p-inputtext-sm"
          placeholder="Email"
        />
      </div>
      <div>
        <InputText
          type="text"
          class="p-inputtext-sm"
          placeholder="PhoneNumber"
          v-model="newDocPhone"
        />
      </div>
    </div>
    <template #footer class="modal-footer">
      <Button
        label="save"
        class="p-button-raised"
        @click="updateNextOfKin(newDocId)"
      />
    </template>
  </Dialog>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
</template>
<script>
import { ref } from "@vue/reactivity";
import { onMounted } from "vue";
import {
  collection,
  deleteDoc,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../assets/firebase";
import { useStore } from "vuex";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

export default {
  setup() {
    onMounted(() => {
      feather.replace();
      chart();
      onSnapshot(collection(db, "nextOfKins"), (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          const pushDocs = {
            id: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            phoneNumber: doc.data().phoneNumber,
          };

          documents.push(pushDocs);
        });
        docs.value = documents;
      });
    });

    const store = useStore();
    const user = ref("");
    const confirm = useConfirm();
    const toast = useToast();
    const router = useRouter();
    const slicedDocs = ref([]);
    const newDocId = ref(0);

    const confirm1 = (id) => {
      confirm.require({
        message: "Do you want to delete this record?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        acceptClass: "p-button-danger",
        accept: () => {
          deleteNextOfKin(id),
            toast.add({
              severity: "info",
              summary: "Confirmed",
              detail: "Record deleted",
              life: 3000,
            });
        },
        reject: () => {
          toast.add({
            severity: "error",
            summary: "Rejected",
            detail: "You have rejected",
            life: 3000,
          });
        },
      });
    };

    const display = ref(false);
    const netOfKin = {};
    user.value = auth.currentUser;
    const chart = () => {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ["Time of Day ", "Heartrate"],
          ["2", 80],
          ["3", 81],
          ["4", 82],
          ["5", 87],
          ["6", 91],
          ["7", 75],
          ["8", 86],
          ["0", 92],
        ]);

        var options = {
          title: "HeartRate",
          curveType: "function",
          legend: { position: "bottom" },
        };

        var chart = new google.visualization.LineChart(
          document.getElementById("mychart")
        );

        chart.draw(data, options);
      }
    };
    const nexOfKinList = collection(db, "nextOfKins");
    const docs = ref([]);
    const showModal = () => {
      newDocName.value = "";
      newDocEmail.value = "";
      newDocPhone.value = "";
      display.value = true;
      console.log("hello");
    };
    const showEditModal = (doc) => {
      newDocId.value = doc.id;
      newDocName.value = doc.name;
      newDocEmail.value = doc.email;
      newDocPhone.value = doc.phoneNumber;
      displayEdit.value = true;
      console.log("hello");
    };
    const logout = () => {
      store.dispatch("logout");
    };
    const menu = ref();
    const deleteUserConfirmation = ref(false);
    const deleteNextOfKin = (id) => {
      deleteDoc(doc(nexOfKinList, id));
    };
    const updateNextOfKin = (id) => {
      // Set the "capital" field of the city 'DC'
      updateDoc(doc(db, "nextOfKins", id), {
        name: newDocName.value,
        email: newDocEmail.value,
        phoneNumber: newDocPhone.value,
      });

      displayEdit.value = false;
      toast.add({
        severity: "info",
        summary: "Confirmed",
        detail: "Record updated",
        life: 3000,
      });
    };
    const toggle = (event) => {
      menu.value.toggle(event);
    };
    const displayEdit = ref(false);
    const newDocName = ref("");
    const newDocEmail = ref("");
    const newDocPhone = ref("");
    const addNewDocument = () => {
      addDoc(collection(db, "nextOfKins"), {
        name: newDocName.value,
        email: newDocEmail.value,
        phoneNumber: newDocPhone.value,
      });
      newDocName.value = "";
      newDocEmail.value = "";
      newDocPhone.value = "";
      display.value = false;
    };
    const items = ref([
      {
        label: "Profile",
        items: [
          {
            label: auth.currentUser.email,
            icon: "pi pi-envelope",
            command: () => {},
          },
        ],
      },
      {
        label: "Next of Kin List",
        items: [
          {
            label: "View List",
            icon: "pi pi-arrow-right",
            command: () => {
              router.push("/list");
            },
          },
        ],
      },
      {
        label: "Logout",
        items: [
          {
            label: "Logout",
            icon: "pi pi-avatar",
            command: () => {
              logout();
            },
          },
        ],
      },
    ]);
    onMounted(() => {
      feather.replace();
      chart();
      onSnapshot(collection(db, "nextOfKins"), (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          const pushDocs = {
            id: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            phoneNumber: doc.data().phoneNumber,
          };

          documents.push(pushDocs);
        });
        docs.value = documents;
        slicedDocs.value = docs.value.slice(0, 3);
      });
    });

    return {
      user,
      chart,
      netOfKin,
      docs,
      display,
      showModal,
      logout,
      deleteNextOfKin,
      deleteUserConfirmation,
      confirm,
      confirm1,
      addNewDocument,
      newDocId,
      newDocName,
      newDocEmail,
      newDocPhone,
      router,
      slicedDocs,
      toggle,
      menu,
      items,
      updateNextOfKin,
      displayEdit,
      showEditModal,
    };
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
  font-family: "Inter", "Helvetica Neue", "Segoe UI", "Fira Sans", Roboto,
    Oxygen, Ubuntu, "Droid Sans", "Arial", sans-serif;
}

nav {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #6c63ff;
  color: white;
  box-shadow: 0px 1px 2px 0px rgb(60 64 67 / 30%),
    0px 1px 3px 1px rgb(60 64 67 / 15%);
  align-items: center;
}
nav ul li {
  list-style: none;
}

button {
  border: #fffdfd;
}
/* .chart {
  height: 400px !important;
  width: 400px !important;
} */
.template .p-button i {
  line-height: 2.25rem;
}
.dashboard {
  display: grid;
  grid-template-columns: 2.3fr 6fr;
  height: 80vh;
  margin-left: 20px;
  margin-top: 20px;
  grid-gap: 30px;
  width: 95%;
}
.profile_section {
  background-color: rgb(255, 255, 255);
  height: 80vh;
  /* border-radius: 15px; */
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  /* display: grid;
  place-items: center; */
  position: relative;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  font-size: 15px;
}
.stats_section {
  display: grid;
  grid-template-rows: 3fr 2fr;
  height: 80vh;
  margin-left: 20px;
  margin-right: 20px;
  position: relative;
}
.heart_rate_graph {
  position: relative;
  height: 100%;
  /* padding: 10px; */
  grid-row: span 1 !important;
  border-radius: 15px;
}
.heart_rate_graph > div {
  position: absolute !important;
  background-color: #fffdfd;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  width: 95%;
  height: 95%;
}
.profile {
  display: flex;
  gap: 20px;
}
.link {
  display: flex;
  align-items: center;
  padding-left: 20px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-image: url("../assets/avatar.svg");
  background-position: center;
  background-size: 60px;
  background-repeat: no-repeat;
  border: 1px solid;
}
.link {
  position: absolute;
  bottom: 20px;
}
.kin_avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: url("../assets/avatar.svg");
  background-position: center;
  background-size: 60px;
  background-repeat: no-repeat;
  border: 1px solid;
}
.name {
  margin-top: 5px;
  font-size: 12px;
}

.modal-content > div {
  padding: 10px;
}
.next_of_kin {
  font-size: 13px;
  /* place-self: center; */
  font-weight: 400;
  display: grid;
}
.profile_heading {
  /* padding-left: 10px; */

  font-size: 16px;
  padding-bottom: 20px;
}
/* .next_of_kin > p {
  padding-left: 10px;
} */
.next_of_kin_list {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  place-self: center;
  position: relative;
  width: 90%;
  border-radius: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
  box-shadow: 0px 1px 2px 0px rgb(60 64 67 / 30%),
    0px 1px 3px 1px rgb(60 64 67 / 15%);
  /* padding-left: 20px; */
}
.next_of_kin_name {
  font-weight: 500;
  padding-bottom: 3px;
}
.next_of_kin_list > div {
  padding-top: 5px;
}
._heading {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  padding-top: 25px;
  padding-bottom: 25px;
}
._heading > P {
  display: flex;
  align-items: center;
}
.modal-header {
  padding-right: 20px;
}
.rate_details {
  position: relative;
  height: 100%;
}
.feather-icon {
  height: 17px;
  color: red;
}
.menu-icon {
  display: none;
}
.feather-icon1 {
  height: 17px;
  color: green;
}
.modal-button {
  padding: 5px;
  padding-right: 10px;
}
.p-button-rounded {
  padding: 15px !important;
}
.logout {
  place-self: center;
}

.nav-right {
  padding-right: 100px;
}
.showModalButton {
  transform: scale(0.8);
}
@media (max-width: 1200px) {
  .dashboard {
    margin: 30px;
    display: grid;
    max-width: 90%;
    grid-template-columns: 1fr;
  }
  .profile_section {
    display: none;
  }
  .heart_rate_graph {
    position: relative !important ;
    height: 75%;
  }
  .heart_rate_graph > div {
    position: absolute;
    width: 95% !important;
  }
  .menu-icon {
    display: block;
  }
  /* nav > div {
    padding-left: 30px;
  } */
  .menu {
    display: flex;
    gap: 20px;
  }
  .profile {
    display: none;
  }
  .nav-right {
    padding-right: 0px;
  }
}
</style>
