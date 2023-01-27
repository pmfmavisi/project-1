<template>
  <nav>
    <div class="menu">
      <p>Dashboard</p>
    </div>
    <div class="nav-right">
      <div class="profile">
        <!-- <div class="profile_heading">Profile</div> -->
        <div style="display:flex; align-items:center" @click="toggle">
                  <Avatar
          icon="pi pi-user"
          size="small"
          v-badge="1"
          shape="circle"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        />
        <i data-feather="chevron-down" class="chevron"></i>
        </div>

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
  <div class="datatable">
    <div v-for="doc in docs" :key="doc.id" class="next_of_kin_list">
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

      </div>
    </div>
  </div>
  <div
    style="
      display: flex;
      justify-content: center;
      font-size: 18px;
      color: #grey;
    "
    v-if="!docs.length"
  >
    List is empty
  </div>
  <Dialog v-model:visible="display" :modal="true" :draggable="false">
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
import {
  collection,
  deleteDoc,
  onSnapshot,
  doc,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { auth, db } from "../assets/firebase";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const newDocId = ref(0);
    const newDocName = ref("");
    const newDocEmail = ref("");
    const newDocPhone = ref("");
    const nexOfKinList = collection(db, "nextOfKins");
    const user = ref();
    const docs = ref([]);
    const displayEdit = ref(false);
    const confirm = useConfirm();
    const toast = useToast();
    const router = useRouter();
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
              deleteNextOfKin,
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
    user.value = auth.currentUser;
    onMounted(() => {
      feather.replace()
      const q = query(collection(db, "nextOfKins" ), where("user", "==", auth.currentUser.email));
      onSnapshot(q , (querySnapshot) => {
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
        label: "Back to DashCoard ",
        items: [
          {
            label: "Dashboard",
            icon: "pi pi-arrow-right",
            command: () => {
              router.push("/home");
            },
          },
        ],
      },
      {
        label: "Logout ",
        items: [
          {
            label: "logout",
            icon: "pi pi-avatar",
            command: () => {
              logout();
            },
          },
        ],
      },
    ]);
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
    const logout = () => {
      store.dispatch("logout");
    };
    const menu = ref();
    const toggle = (event) => {
      menu.value.toggle(event);
    };
    const display = ref(false);
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

    const deleteNextOfKin = (id) => {
      deleteDoc(doc(nexOfKinList, id));
    };
    return {
      nexOfKinList,
      user,
      docs,
      confirm1,
      showModal,
      display,
      deleteNextOfKin,
      items,
      menu,
      toggle,
      showEditModal,
      displayEdit,
      newDocId,
      newDocName,
      newDocEmail,
      newDocPhone,
      updateNextOfKin,
      logout,
    };
  },
};
</script>
<style scoped>
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
  background-color: #fff;
  width: 40%;
}
.chevron   {

  transform: scale(0.8);
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
.profile {
  display: flex;
  gap: 20px;
}
.datatable {
  padding: 30px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.modal-content > div {
  padding: 10px;
}
.doc-edit {
  transform: scale(1.3);
}
.nav-right {

  padding-right: 100px;
}
.menu-icon {
  display: none;
}
@media (max-width: 800px) {
  nav {
    display: flex;
    justify-content: space-between;
  }
    .profile {
    display: none;
  }
  .next_of_kin_list {
    display: block !important;
  }
  .nav-right {
  padding-right: 0px;
}
  .next_of_kin_email {
    font-size: 13px;
    color: gray;
  }
}
@media (max-width: 480px) {
  nav {
    display: flex;
    justify-content: space-between;
  }
    .nav-right {
  padding-right: 0px;
}
  .datatable {

    display: block !important;
    
  }
  .profile {
    display: none;
  }
    .menu-icon {
    display: block;
  }
  .next_of_kin_list {
    display: block !important;
    width: 80% !important;
  }
  .next_of_kin_email {
    font-size: 13px;
    color: gray;
  }
}
</style>
