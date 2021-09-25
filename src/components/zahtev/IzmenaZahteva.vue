<template>
  <el-form
    :model="form"
    label-width="120px"
  >
    <el-form-item label="Datum zahteva(dd-mm-yyyy)">
        <el-input v-model="form.date"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">Pronadji</el-button>
    </el-form-item>
    <el-table :data="form.requests" style="min-height: 200px; background-color: rgba(1,1,1, 0.11)">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="date" label="Datum"></el-table-column>
      <el-table-column prop="approved" label="Odobreno"></el-table-column>
      <el-table-column label="Edit">
        <template #default="scope">
          <el-button size="mini" @click="handleEditRequest(scope.$index, scope.row)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="currentRequest">
      <el-form-item class="zaposleni" label="Odaberite zaposlenog">
        <select
            @change="handleEmployeeChange"
            :value="currentRequest.employee"
            class="select"
            style="min-width: 200px;"
        >
            <option
                v-for="employee in employees"
                :key="employee.id"
                :label="`${employee.firstName} ${employee.lastName}`"
                :value="employee"
            >
            </option>
        </select>
        </el-form-item>
        <el-form-item label="Datum">
            <el-input v-model="currentRequest.date"></el-input>
        </el-form-item>
        <el-form-item label="Odobreno">
            <el-radio-group v-model="currentRequest.approved">
                <el-radio-button label="Da"></el-radio-button>
                <el-radio-button label="Ne"></el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="Opis">
            <el-input
                v-model="description"
                type="textarea"
                :rows="2"
            >
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleAddRequest">Potvrdi</el-button>
            <el-button type="primary" @click="handleSaveEdit">Sacuvaj izmenu</el-button>
        </el-form-item>
        <el-table :data="currentRequest.requestItems" style="min-height: 200px; background-color: rgba(1,1,1, 0.11)">
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
export default {
    setup() {
        const form = reactive({
          date: '',
          requests: [],
        })
        // eslint-disable-next-line no-unused-vars
        let requestId

        const currentRequest = ref(null)
        const currentRequestItemEdit = ref(null)
        const description = ref('')

        const cities = ref([])
        const streets = ref([])
        const employees = ref([])

        // const requestItems = ref([])

        const requestTemplate = {
          approved: undefined,
          employee: {},
          requestItems: [],
          date: ''
        }

        const handleSearch = () => {
            console.log(form.date)
            fetch(`http://localhost:8080/vip/request/find/${form.date}-00:00:00`)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach(requestItem => {
                        requestItem.approved = requestItem.approved ? 'Da' : 'Ne'
                    });
                    form.requests = data
                })
                .catch((error) => console.error(error))
        }

        const handleAddRequest = () => {
            const requestItemObj = {
                requestId: requestId,
                orderNumber: currentRequest.value.requestItems.length + 1,
                description: description.value
            }
            currentRequest.value.requestItems.push(requestItemObj)
            description.value = ''
        }

        fetch('http://localhost:8080/vip/api/employee')
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                employees.value = data._embedded.employee
            })
            .catch((error) => console.log(error))

        const handleCitySelected = () => {
            fetch(`http://localhost:8080/vip/client/address/${currentRequest.value.address.city.postalCode}`)
                .then((response) => response.json())
                .then((data) => {
                    streets.value = data
                })
                .catch((error) => console.log(error))
        }

        const handleEditRequest = (index) => {
            // console.log(form.requests[index])
            currentRequest.value = form.requests[index]
            // console.log(currentRequest.value)
        }

        const handleSubmitForm = () => {
            requestTemplate.approved = currentRequest.value.approved === 'Da' ? true : false
            requestTemplate.employee = currentRequest.value.employee
            requestTemplate.date = currentRequest.value.date
            console.log(requestTemplate.date)
            requestTemplate.requestItems = currentRequest.value.requestItems.map((item) => {
                return {
                    orderNumber: item.orderNumber,
                    description: item.description
                }
            })
            console.log(requestTemplate)
            fetch(`http://localhost:8080/vip/request/${currentRequest.value.id}`, {
                    method: 'PUT',
                    headers: {
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestTemplate)
                 })
                .then((response) => console.log(response))
                .catch((error) => console.log(error))
        }

        const handleEmployeeChange = (e) => {
            currentRequest.value.employee = employees.value[e.target.options.selectedIndex]
        }

        // eslint-disable-next-line no-unused-vars
        const handleEditRequestItem = (index, row) => {
            const editItemData = {
                index: index,
                data: JSON.parse(JSON.stringify(currentRequest.value.requestItems[index])),
            }
            currentRequestItemEdit.value = editItemData
            description.value = editItemData.data.description
        }

        // eslint-disable-next-line no-unused-vars
        const handleDeleteRequestItem = (index, row) => {
            currentRequest.value.requestItems.splice(index, 1)
        }

        const handleSaveEdit = () => {
            currentRequestItemEdit.value.data.description = description.value
            description.value = ''
            currentRequestItemEdit.value = null
            currentRequest.value.requestItems[currentRequestItemEdit.value.index] = currentRequestItemEdit.value.data
        }

        return {
          form,
          description,
          currentRequest,
          currentRequestItemEdit,
        //   requestItems,
          cities,
          streets,
          employees,
          handleCitySelected,
          handleAddRequest,
          handleSearch,
          handleEditRequest,
          handleSubmitForm,
          handleEmployeeChange,
          handleEditRequestItem,
          handleDeleteRequestItem,
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
