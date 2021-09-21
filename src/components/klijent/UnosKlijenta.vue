<template>
  <el-form label-width="120px">
    <el-form-item label="PIB">
        <el-input v-model="pib"></el-input>
    </el-form-item>
    <el-form-item label="Naziv klijenta">
        <el-input v-model="nazivKlijenta"></el-input>
    </el-form-item>
    <el-form-item label="Telefon">
        <el-input v-model="telefon"></el-input>
    </el-form-item>
    <el-form-item label="E-mail">
        <el-input v-model="email"></el-input>
    </el-form-item>
    <el-form-item label="Web strana">
        <el-input v-model="webStrana"></el-input>
    </el-form-item>
    <el-form-item label="Godina osnivanja">
        <el-input v-model="godinaOsnivanja"></el-input>
    </el-form-item>
    <el-select @change="handleCitySelected" v-model="mesto" placeholder="Odaberite mesto">
        <el-option
            v-for="var_mesto in mesta"
            :key="var_mesto.postalCode"
            :label="var_mesto.name"
            :value="var_mesto"
        >
        </el-option>
    </el-select>
    <el-select v-model="ulica" placeholder="Odaberi ulicu">
        <el-option
            v-for="var_ulica in ulice"
            :key="var_ulica.id"
            :label="var_ulica.street"
            :value="var_ulica"
        >
        </el-option>
    </el-select>
    <el-select v-model="sifraDelatnosti" placeholder="Odaberi sifru delatnosti">
        <el-option
            v-for="var_delatnost in delatnosti"
            :key="var_delatnost.code"
            :label="var_delatnost.name"
            :value="var_delatnost"
        >
        </el-option>
    </el-select>
    <el-select v-model="potencijalniKlijent" placeholder="Odaberi potencijalnog klijenta">
        <el-option
            v-for="var_klijent in potencijalniKlijenti"
            :key="var_klijent.id"
            :label="var_klijent.name"
            :value="var_klijent"
        >
        </el-option>
    </el-select>
    <!-- <el-form-item label="Ulica">
        <el-input v-model="ulica"></el-input>
    </el-form-item> -->
    <el-form-item label="Broj">
        <el-input v-model="broj"></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm()">Unesi</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive, ref, toRefs } from '@vue/reactivity'
export default {
    setup() {
        const form = reactive({
          pib: '',
          nazivKlijenta: '',
          telefon: '',
          email: '',
          webStrana: '',
          godinaOsnivanja: '',
          ulica: '',
          broj: '',
          sifraDelatnosti: '',
          potencijalniKlijent: '',
          mesto: undefined,
        })

        const mesta = ref([])
        const ulice = ref([])
        const delatnosti = ref([])
        const potencijalniKlijenti = ref([])

        const postClientObjectTemplate = {
            pib: '',
            name: '',
            email: '',
            webPage: '',
            phoneNumber: '',
            yearOfEstablishment: '',
            address: {
                id: 0,
                number: 0
            },
            city: {
                postalCode: 0
            },
            potentialClient: {
                id: 0
            },
            activity: {
                code: 0
            }
        }


        fetch('http://localhost:8080/vip/api/city')
            .then((response) => response.json())
            .then((data) => { 
                mesta.value = data._embedded.city
            })
            .catch((error) => console.log(error))

        fetch('http://localhost:8080/vip/api/activity')
            .then((response) => response.json())
            .then((data) => {
                delatnosti.value = data._embedded.activity
            })
            .catch((error) => console.log(error))

        
        fetch('http://localhost:8080/vip/api/potentialClient')
            .then((response) => response.json())
            .then((data) => {
                console.log(data) 
                potencijalniKlijenti.value = data._embedded.potentialClient
            })
            .catch((error) => console.log(error))
    
        const handleCitySelected = () => {
            fetch(`http://localhost:8080/vip/client/address/${form.mesto.postalCode}`)
                .then((response) => response.json())
                .then((data) => {
                    ulice.value = data
                })
                .catch((error) => console.log(error))
        }

        const submitForm = () => {
            console.log(JSON.parse(JSON.stringify(form)))
            postClientObjectTemplate.pib = form.pib
            postClientObjectTemplate.name = form.nazivKlijenta
            postClientObjectTemplate.webPage = form.webStrana
            postClientObjectTemplate.phoneNumber = form.telefon
            postClientObjectTemplate.email = form.email
            postClientObjectTemplate.yearOfEstablishment = parseInt(form.godinaOsnivanja)
            postClientObjectTemplate.address.id = form.ulica.id
            postClientObjectTemplate.address.number = parseInt(form.broj)
            postClientObjectTemplate.city.postalCode = form.mesto.postalCode
            postClientObjectTemplate.potentialClient.id = form.potencijalniKlijent.id
            postClientObjectTemplate.activity.code = form.sifraDelatnosti.code
            console.log(postClientObjectTemplate)
            fetch('http://localhost:8080/vip/api/client', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postClientObjectTemplate)
            })
                .then((response) => console.log(response))
                .catch((error) => console.log(error))
        }

        return {
            ...toRefs(form),
            submitForm,
            handleCitySelected,
            mesta,
            ulice,
            delatnosti,
            potencijalniKlijenti,
        }
    }
}
</script>

<style>



</style>
