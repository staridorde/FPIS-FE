<template>
  <el-form
    ref="formaZahtev"
    :model="form"
    label-width="120px"
  >
    <el-form-item class="zaposleni" label="Odaberite zaposlenog">
      <select v-model="form.zaposleni" class="select">
          <option
              v-for="zaposlen in sviZaposleni"
              :key="zaposlen.id"
              :label="`${zaposlen.firstName} ${zaposlen.lastName}`"
              :value="zaposlen"
          >
          </option>
      </select>
    </el-form-item>
    <el-form-item label="Datum(yyyy-mm-dd)">
        <el-input v-model="form.datum"></el-input>
    </el-form-item>
    <el-form-item label="Odobreno">
      <el-radio-group v-model="form.odobreno">
        <el-radio-button label="Da"></el-radio-button>
        <el-radio-button label="Ne"></el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="dodaj">Unesi</el-button>
    </el-form-item>
    <div v-if="requestMade">
      <el-form-item label="Opis">
        <el-input
          v-model="opis"
          type="textarea"
          :rows="2"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAddRequest">Potvrdi</el-button>
        <el-button type="primary" @click="handleSaveEdit">Potvrdi izmenu</el-button>
      </el-form-item>
      <el-table :data="requestItems" style="min-height: 200px; background-color: rgba(1,1,1, 0.11)">
        <el-table-column prop="orderNumber" label="RB"></el-table-column>
        <el-table-column prop="requestId" label="IDZahteva"></el-table-column>
        <el-table-column prop="description" label="Opis"></el-table-column>
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="mini" @click="handleEditRequestItem(scope.$index, scope.row)"
              >Edit</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteRequestItem(scope.$index, scope.row)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-form-item>
        <el-button type="primary" @click="handleSubmitForm">Potvrdi sve</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { ElNotification } from 'element-plus'

export default {
  setup() {
    const formaZahtev = ref(null)
    const form = reactive({
      zaposleni: {},
      datum: '',
      odobreno: undefined,
    })

    const opis = ref('')
    const requestItems = ref([])
    const currentRequestItemEdit = ref(null)
    const requestMade = ref(false)

    const requestTemplate = {
      approved: undefined,
      employee: {},
      requestItems: [],
      date: ''
    }

    const sviZaposleni = ref([])

    // eslint-disable-next-line no-unused-vars
    let requestId

    fetch('http://localhost:8080/vip/api/employee')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        sviZaposleni.value = data._embedded.employee
      })

    const dodaj = () => {
      requestTemplate.approved = form.odobreno === 'Da' ? true : false
      requestTemplate.employee.id = form.zaposleni.id
      requestTemplate.date = form.datum
      console.log(requestTemplate)
      fetch('http://localhost:8080/vip/request', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestTemplate)
      })
        .then((request) => request.json())
        .then((data) => {
          requestMade.value = true
          requestId = data
        })
        .catch((error) => console.log(error))
    }

    const odustani = () => {
      console.log(form)
      // formaZahtev.value.resetFields()
      // console.log(formaZahtev.value)
    }

    const handleAddRequest = () => {
      const requestItemObj = {
        requestId: requestId,
        orderNumber: requestItems.value.length + 1,
        description: opis.value
      }
      requestItems.value.push(requestItemObj)
      opis.value = ''
    }

    // eslint-disable-next-line no-unused-vars
    const handleEditRequestItem = (index, row) => {
      const editItemData = {
          index: index,
          data: JSON.parse(JSON.stringify(requestItems.value[index])),
      }
      currentRequestItemEdit.value = editItemData
      opis.value = editItemData.data.description
    }

    // eslint-disable-next-line no-unused-vars
    const handleDeleteRequestItem = (index, row) => {
      requestItems.value.splice(index, 1)
    }

    const handleSaveEdit = () => {
      currentRequestItemEdit.value.data.description = opis.value
      requestItems.value[currentRequestItemEdit.value.index] = currentRequestItemEdit.value.data
      currentRequestItemEdit.value = null
      opis.value = ''
    }

    const handleSubmitForm = () => {
      requestTemplate.approved = form.odobreno === 'Da' ? true : false
      requestTemplate.employee = form.zaposleni
      requestTemplate.date = form.datum
      requestTemplate.requestItems = requestItems.value.map((item) => {
        return {
          orderNumber: item.orderNumber,
          description: item.description
        }
      })
      console.log(requestTemplate)
      fetch(`http://localhost:8080/vip/request/${requestId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestTemplate)
      })
      .then((response) => response.text())
      .then((data) => {
        console.log(data)
        ElNotification({
          title: data,
          message: 'You have succesfully saved a new request!',
          type: 'success',
        })
      })
      .catch(() => {
        ElNotification({
          title: 'Error',
          message: 'The request has not been made!',
          type: 'error',
        })
      })
    }

    return {
      opis,
      sviZaposleni,
      formaZahtev,
      form,
      requestMade,
      requestItems,
      requestId,
      handleAddRequest,
      handleSubmitForm,
      handleEditRequestItem,
      handleDeleteRequestItem,
      odustani,
      dodaj,
      handleSaveEdit,
    }
  }
}
</script>

<style>

.zaposleni select {
  width: 100%;
}



</style>
