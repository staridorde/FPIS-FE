<template>
  <el-form
    :model="form"
    label-width="120px"
  >
    <el-form-item label="Naziv klijenta">
        <el-input v-model="form.naziv"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">Pronadji</el-button>
    </el-form-item>
    <el-table :data="form.clients" style="min-height: 200px; background-color: rgba(1,1,1, 0.11)">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="Naziv"></el-table-column>
      <el-table-column prop="pib" label="PIB"></el-table-column>
      <el-table-column prop="address.city.name" label="Mesto"></el-table-column>
      <el-table-column label="Edit">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="currentClient">
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
        <el-select v-model="currentClient.address.street" placeholder="Odaberite ulicu">
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
        <!-- <el-select v-model="potencijalniKlijent" placeholder="Odaberi potencijalnog klijenta">
            <el-option
                v-for="var_klijent in potencijalniKlijenti"
                :key="var_klijent.id"
                :label="var_klijent.name"
                :value="var_klijent"
            >
            </el-option>
        </el-select> -->
        <!-- <el-select v-model="potencijalniKlijent" placeholder="Odaberi potencijalnog klijenta">
            <el-option
                v-for="var_klijent in potencijalniKlijenti"
                :key="var_klijent.id"
                :label="var_klijent.name"
                :value="var_klijent"
            >
            </el-option>
        </el-select> -->
        <el-form-item>
            <el-button type="primary" @click="handleSaveEdit">Potvrdi izmene</el-button>
        </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
export default {
    setup() {
        const form = reactive({
          naziv: '',
          clients: [],
        })
        const currentClient = ref(null)

        const cities = ref([])
        const streets = ref([])
        const activities = ref([])

        const postClientObjectTemplate = {
            PIB: '',
            name: '',
            email: '',
            webPage: '',
            phoneNumber: '',
            yearOfEstablishment: '',
            address: {
                id: 0,
                number: 0,
                city: {
                    postalCode: 0
                }
            },
            potentialClient:{
                id: 0
            },
            activity: {
                code: 0
            }
        }


        const handleSearch = () => {
            fetch(`http://localhost:8080/vip/client/${form.naziv}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    form.clients = data
                })
                .catch((error) => console.error(error))
        }

        fetch('http://localhost:8080/vip/api/activity')
            .then((response) => response.json())
            .then((data) => {
                activities.value = data._embedded.activity
            })
            .catch((error) => console.log(error))

        const handleCitySelected = () => {
            fetch(`http://localhost:8080/vip/client/address/${currentClient.value.address.city.postalCode}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    streets.value = data
                })
                .catch((error) => console.log(error))
        }
        
        fetch('http://localhost:8080/vip/api/city')
            .then((response) => response.json())
            .then((data) => { 
                cities.value = data._embedded.city
            })
            .catch((error) => console.log(error))
        
        const handleEdit = (index) => {
            console.log(index)
            currentClient.value = form.clients[index]
            console.log(currentClient.value)
        }


        const handleSaveEdit = () => {
            // console.log(JSON.parse(JSON.stringify(form)))
            postClientObjectTemplate.PIB = currentClient.value.pib
            postClientObjectTemplate.name = currentClient.value.name
            postClientObjectTemplate.webPage = currentClient.value.webPage
            postClientObjectTemplate.phoneNumber = currentClient.value.phoneNumber
            postClientObjectTemplate.yearOfEstablishment = parseInt(currentClient.value.yearOfEstablishment)
            postClientObjectTemplate.address.id = currentClient.value.address.id
            postClientObjectTemplate.address.number = parseInt(currentClient.value.address.number)
            postClientObjectTemplate.address.city.postalCode = currentClient.value.address.city.postalCode
            postClientObjectTemplate.potentialClient = currentClient.value.potentialClient
            postClientObjectTemplate.activity.code = currentClient.value.activity.code
            postClientObjectTemplate.email = currentClient.value.email
            console.log(postClientObjectTemplate)
            fetch(`http://localhost:8080/vip/api/client/${currentClient.value.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postClientObjectTemplate)
            })
                .then((response) => console.log(response))
                .catch((error) => console.log(error))
        }

        return {
          form,
          currentClient,
          cities,
          streets,
          activities,
          handleCitySelected,
          handleSearch,
          handleEdit,
          handleSaveEdit,
        }
    }
}
</script>

<style>

</style>
