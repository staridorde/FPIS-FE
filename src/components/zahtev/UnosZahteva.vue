<template>
  <el-form
    ref="formaZahtev"
    :model="form"
    label-width="120px"
  >
    <el-form-item>
      <el-select v-model="form.zaposleni" placeholder="Odaberite zaposlenog">
          <el-option
              v-for="zaposlen in sviZaposleni"
              :key="zaposlen.id"
              :label="`${zaposlen.firstName} ${zaposlen.lastName}`"
              :value="zaposlen"
          >
          </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Datum(dd-mm-yyyy)">
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
      <el-button type="primary" @click="odustani">Odustani</el-button>
    </el-form-item>
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
      <el-button type="primary">Izmeni</el-button>
      <el-button type="primary">Obrisi</el-button>
    </el-form-item>
    <el-table :data="requestItems" style="min-height: 200px; background-color: rgba(1,1,1, 0.11)">
      <el-table-column prop="orderNumber" label="RB"></el-table-column>
      <el-table-column prop="requestId" label="IDZahteva"></el-table-column>
      <el-table-column prop="description" label="Opis"></el-table-column>
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-form-item>
      <el-button type="primary" @click="handleSubmitForm">Potvrdi sve</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
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

    const handleEdit = (index, row) => {
      console.log(index, row)
    }

    const handleDelete = (index, row) => {
      console.log(index, row)
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
        .then((response) => console.log(response))
        .catch((error) => console.log(error))
    }

    return {
      opis,
      sviZaposleni,
      formaZahtev,
      form,
      requestItems,
      requestId,
      handleAddRequest,
      handleSubmitForm,
      handleEdit,
      handleDelete,
      odustani,
      dodaj,
    }
  }
}
</script>

<style>

</style>
