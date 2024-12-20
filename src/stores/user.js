import {axios,setBearerToken} from '@/lib/axios'
import { useStorage } from '@vueuse/core'
import { defineStore, acceptHMRUpdate } from 'pinia'
import swal from 'sweetalert'
import { initializeEcho,disconnectEcho } from '../services/echo'

const csrf = () => axios.get('/sanctum/csrf-cookie')

export const useUsers = defineStore('users', {
    state: () => ({
        userData: [],
        authStatus: [],
        announcement: [],
        messages: [],
        certificates: [],
        certificateRequest: [],
        notificationModal: {
            isOpen: false,
            title: '',
            message: ''
        },
        echoNotificationListener: false,
    }),

    getters: {
        authUser: state => state.authStatus === 204 || state.authStatus === 200,
        hasUserData: state => Object.keys(state.userData).length > 0,
        hasCertificateRequest: state => Object.keys(state.certificateRequest).length > 0,
        hasCertificate: state => Object.keys(state.certificates).length > 0,
        hasAnnouncement: state => Object.keys(state.announcement).length > 0,
        hasVerified: state =>
            Object.keys(state.userData).length > 0
                ? state.userData.email_verified_at !== null
                : false,
    },

    actions: {
        showNotification(title, message) {
            this.notificationModal.isOpen = true
            this.notificationModal.title = title
            this.notificationModal.message = message
            
            // Auto-close after 5 seconds
            setTimeout(() => {
              this.closeNotification()
            }, 5000)
          },
      
          closeNotification() {
            this.notificationModal.isOpen = false
            this.notificationModal.title = ''
            this.notificationModal.message = ''
          },
        handleNewCertificate(certificate)
        {
            this.certificates.unshift(certificate)
            this.showNotification('New Certificate', `A new certificate "${certificate.name}" has been added.`)

        },
        handleCertificateDeleted(certificate)
        {
            this.certificates = this.certificates.filter(cert => cert.id !== certificate.id)
            this.showNotification('Certificate Deleted', `The certificate "${certificate.certificate_name}" has been deleted.`)  
        },
        handleApprovedCertificate(certificate){
            const index = this.certificateRequest.findIndex(req => req.id === certificate.id)
            
            if(index != -1){
                this.certificateRequest[index].status = 'approved'
            }
            this.showNotification('Certificate approved', `Certificate request "${certificate.certificate.name}" has been approved`)
        },
        handleRejectCertificateRequest(certificate){
            const index = this.certificateRequest.findIndex(req => req.id === certificate.id)
            
            if(index != -1){
                this.certificateRequest[index].status = certificate.status
            }
            this.showNotification('Certificate rejected', `Certificate request "${certificate.certificate_name}" has been rejected`)
        },
        async getData() {
            await axios
                .get('/api/user')
                .then(response => {
                    this.userData = response.data
                })
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    this.router.push('/verify-email')
                })
        },
        async sendMessage(form){

            await axios
                .post('/api/user/messages',form.value)
                    .then(res=>{
                        this.messages.push(res.data)
                    })
                    .catch(error=>{
                        console.log("Error in user message function in store: "+error)
                    })
        },
        async getCertificates(){
            await axios   
                .get('/api/certificates')
                    .then(res=>{
                        this.certificates = res.data.certificate
                    })
                    .catch(error=>{
                        console.log("Error in get certificate function in store: "+error)
                        this.certificates = []
                    })
        },
        async getCertificate(id) {
            try {
                const response = await axios.get(`/api/certificates/${id}`);
                return response.data.certificate;
            } catch (error) {
                console.error("Error fetching certificate:", error);
                throw error;
            }
        },       
        async getCertificateRequest(){
            await axios  
                .get('/api/certificates/requests/my-requests')
                    .then(response=>{
                        this.certificateRequest = response.data
                    })
                    .catch(error=>{
                        if(error.response.status !== 402) throw error
                    })
        },
        async getLatestAnnouncement() {
            try {
              const response = await axios.get('/api/announcement')
              this.announcement = response.data
            } catch (error) {
              console.error("Error while fetching the announcement:", error)
              this.announcement = []
            }
          },
        async requestCertificate(form) {
               await axios
                    .post('/api/certificates/requests', form)
                    .then(res=>{
                        this.certificateRequest.unshift(res.data.request)
                        this.router.push({name: 'certificate_requested'})
                    })
                    .catch(error=>{
                        console.log("Error while fetching certificate request")
                    })
          },          
        async register(form, setErrors, processing) {
            await csrf()

            processing.value = true

            axios
                .post('/user/register', form.value)
                .then(response => {
                    this.authStatus = response.status
                    processing.value = false

                    localStorage.setItem('authToken',response.data.token)

                    this.router.push({ name: 'dashboard' })
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                    processing.value = false
                })
        },

        async login(form, setErrors, processing) {
            await csrf()

            processing.value = true

            axios
                .post('/user/login', form.value)
                .then(response => {
                    this.authStatus = response.status
                    processing.value = false
                    const token = response.data.token
                    console.log(token)
                    setBearerToken(token)
                    localStorage.setItem('authToken',token)

                    initializeEcho(token)
                    
                    this.router.push({ name: 'dashboard' })
                })
                .catch(error => {
                    processing.value = false

                    if(error.response){
                        if(error.response.status === 403){
                            setErrors.value = ['Your account is temporarily locked.'];
                        }else if(error.response.status === 422){
                            setErrors.value = Object.values(error.response.data.errors).flat();
                        }else{
                            setErrors.value = [error.response.data.message || 'An unexpected error occurred.'];
                        }
                    }else{
                        setErrors.value = ['Unable to connect to the server. Please try again later.'];
                    }
                   
                })
        },
        async deleteCertificate(id) {
            try {
                const response = await axios.delete(`/api/certificates/requests/${id}`);
                swal('Deleted Successfully',response.data.message,'success')
      
                 this.certificateRequest = this.certificateRequest.filter(req => req.id !== id);
      
                return response.data
            } catch (error) {
                console.log("Error while deleting a certificate", error);
                swal('Error','An error occurred while deleting the certificate', 'error')
                throw error
            }
        },

        async forgotPassword(form, setStatus, setErrors, processing) {
            await csrf()

            processing.value = true

            axios
                .post('/user/forgot-password', form.value)
                .then(response => {
                    setStatus.value = response.data.status
                    processing.value = false
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                    processing.value = false
                })
        },

        async resetPassword(form, setErrors, processing) {
            await csrf()

            processing.value = true

            await axios
                .post('/user/reset-password', form.value)
                .then(response => {
                    this.router.push(
                        '/login?reset=' + btoa(response.data.status),
                    )
                    processing.value = false
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                    processing.value = false
                })
        },
        resendEmailVerification(setStatus, processing) {
            processing.value = true

            axios.post('/user/email/verification-notification').then(response => {
                setStatus.value = response.data.status
                processing.value = false
            })
        },

        async logout() {
            await axios
                .post('/user/logout')
                .then(() => {
                    this.$reset()
                    localStorage.removeItem('authToken')
                    disconnectEcho()
                    console.log("User  logout and echo disconnected")
                    this.router.push({ name: 'welcome' })
                })
                .catch(error => {
                    if (error.response.status !== 422){
                        localStorage.clear()   
                        this.router.push({name: 'login'})
                    }
                })
        },
    },
    persist: true
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsers, import.meta.hot))
}
