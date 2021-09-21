<template>
<!-- <div v-if="currentClient">
        <el-form-item label="ID">
            <el-input v-model="currentClient.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="PIB">
            <el-input v-model="currentClient.pib"></el-input>
        </el-form-item>
        <el-form-item label="Naziv klijenta">
            <el-input v-model="currentClient.name"></el-input>
        </el-form-item>
        <el-form-item label="Telefon">
            <el-input v-model="currentClient.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="E-mail">
            <el-input v-model="currentClient.email"></el-input>
        </el-form-item>
        <el-form-item label="Web strana">
            <el-input v-model="currentClient.webPage"></el-input>
        </el-form-item>
        <el-form-item label="Godina osnivanja">
            <el-input v-model="currentClient.yearOfEstablishment"></el-input>
        </el-form-item>
        <el-select @change="handleCitySelected" v-model="currentClient.address.city" placeholder="Odaberite mesto">
            <el-option
                v-for="city in cities"
                :key="city.postalCode"
                :label="city.name"
                :value="city"
            >
            </el-option>
        </el-select>
        <el-select v-model="currentClient.address" placeholder="Odaberite ulicu">
            <el-option
                v-for="street in streets"
                :key="street.id"
                :label="street.street"
                :value="street"
            >
            </el-option>
        </el-select>
        <el-select v-model="currentClient.activity" placeholder="Odaberi potencijalnog klijenta">
            <el-option
                v-for="activity in activities"
                :key="activity.code"
                :label="activity.name"
                :value="activity"
            >
            </el-option>
        </el-select>
        <el-form-item>
            <el-button type="primary" @click="handleSaveEdit">Potvrdi izmene</el-button>
        </el-form-item>
    </div> -->

  <el-form
    :model="form"
    label-width="120px"
  >
    <el-form-item label="Datum zahteva(yyyy-mm-dd)">
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
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="currentRequest">
      <el-form-item label="Odaberite zaposlenog">
        <el-select v-model="currentRequest.employee">
            <el-option
                v-for="employee in employees"
                :key="employee.id"
                :label="`${employee.firstName} ${employee.lastName}`"
                :value="employee"
            >
            </el-option>
        </el-select>
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
        <!-- <el-form-item>
            <el-button type="primary" @click="dodaj">Unesi</el-button>
            <el-button type="primary" @click="odustani">Odustani</el-button>
        </el-form-item> -->
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
            <el-button type="primary">Izmeni</el-button>
            <el-button type="primary">Obrisi</el-button>
        </el-form-item>
        <el-table :data="currentRequest.requestItems" style="min-height: 200px; background-color: rgba(1,1,1, 0.11)">
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
        const description = ref('')

        const cities = ref([])
        const streets = ref([])
        const employees = ref([])

        // const requestItems = ref([])

        const requestTemplate = {
          approved: undefined,
          employee: {
            id: undefined
          },
          requestItems: [],
          date: ''
        }

        // const postClientObjectTemplate = {
        //     PIB: '',
        //     name: '',
        //     email: '',
        //     webPage: '',
        //     phoneNumber: '',
        //     yearOfEstablishment: '',
        //     address: {
        //         id: 0,
        //         number: 0,
        //         city: {
        //             postalCode: 0
        //         }
        //     },
        //     potentialClient:{
        //         id: 0
        //     },
        //     activity: {
        //         code: 0
        //     }
        // }


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

        // const dodaj = () => {
        //     requestTemplate.approved = form.approved === 'Da' ? true : false
        //     requestTemplate.employee.id = form.employee.id
        //     requestTemplate.date = form.date
        //     fetch('http://localhost:8080/vip/request', {
        //       method: 'POST',
        //       headers: {
        //         "Content-Type": "application/json"
        //       },
        //       body: JSON.stringify(requestTemplate)
        //     })
        //       .then((request) => request.json())
        //       .then((data) => {
        //         requestId = data
        //        })
        //       .catch((error) => console.log(error))
        // }

        // const odustani = () => {
        //     // formaZahtev.value.resetFields()
        //     // console.log(formaZahtev.value)
        // }

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

        const handleEdit = (index) => {
            console.log(index)
            currentRequest.value = form.requests[index]
            // currentRequest.value.approved = currentRequest.value.approved ? 'Da' : 'Ne'
        }

        const handleSubmitForm = () => {
            requestTemplate.approved = currentRequest.value.approved === 'Da' ? true : false
            requestTemplate.employee.id = currentRequest.value.employee.id
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

        return {
          form,
          description,
          currentRequest,
        //   requestItems,
          cities,
          streets,
          employees,
          handleCitySelected,
          handleAddRequest,
          handleSearch,
          handleEdit,
        //   dodaj,
        //   odustani,
          handleSubmitForm,
        //   handleSaveEdit,
        }
    }
}
</script>

<style>

</style>
