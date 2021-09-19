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
        <el-input v-model="eMail"></el-input>
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
            :key="var_mesto.id"
            :label="var_mesto.naziv"
            :value="var_mesto"
        >
        </el-option>
    </el-select>
    <el-select v-model="ulica" placeholder="Odaberi ulicu">
        <el-option
            v-for="var_ulica in ulice"
            :key="var_ulica.id"
            :label="var_ulica.naziv"
            :value="var_ulica.naziv"
        >
        </el-option>
    </el-select>
    <!-- <el-form-item label="Ulica">
        <el-input v-model="ulica"></el-input>
    </el-form-item> -->
    <el-form-item label="Broj">
        <el-input v-model="broj"></el-input>
    </el-form-item>
    <el-form-item label="Sifra delatnosti">
        <el-input v-model="sifraDelatnosti"></el-input>
    </el-form-item>
    <el-form-item label="Potencijalni klijent">
        <el-input v-model="potencijalniKlijent"></el-input>
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
          eMail: '',
          webStrana: '',
          godinaOsnivanja: '',
          ulica: '',
          broj: '',
          sifraDelatnosti: '',
          potencijalniKlijent: '',
          mesto: '',
        })

        const mesta = ref([])
        const ulice = ref([])

        const postClientObjectTemplate = {
            PIB: '',
            name: '',
            email: '',
            webPage: '',
            phone: '',
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


        fetch('http://localhost:8080/vip/api/city', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((data) => console.log(data))

        fetch('http://localhost:8080/vip/api/activity', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((data) => console.log(data))

        
        fetch('http://localhost:8080/vip/api/potentialClient', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
    
        const handleCitySelected = () => {
            fetch(`http://localhost:8080/vip/client/${form.mesto.broj}`, {
                method: 'GET'
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
        }

        const submitForm = () => {
            postClientObjectTemplate.PIB = form.pib
            postClientObjectTemplate.name = form.nazivKlijenta
            postClientObjectTemplate.webPage = form.webStrana
            postClientObjectTemplate.phone = form.telefon
            postClientObjectTemplate.yearOfEstablishment = form.godinaOsnivanja
            postClientObjectTemplate.address.id = form.ulica.id
            postClientObjectTemplate.address.number = form.broj
            postClientObjectTemplate.city.postalCode = form.mesto.postanskiBroj
            postClientObjectTemplate.potentialClient.id = form.potencijalniKlijent.id
            postClientObjectTemplate.activity.code = form.sifraDelatnosti
            console.log(postClientObjectTemplate)
            fetch('http://localhost:8080/vip/api/client', {
                method: 'POST',
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
        }
    }
}
</script>

<style>



</style>
