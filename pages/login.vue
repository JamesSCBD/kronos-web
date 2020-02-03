<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12">
          <h1 class="text-center">
            <img src="https://www.cbd.int/styles/ui/templates/cbd2011/images/logo-cbd-leaf-line.gif" style="max-height: 30px; margin: 0 10px 5px 0;">Kronos
          </h1>
          <h3 class="text-center mb-5">
            Conference Registration System
          </h3>
        </div>

        <div v-if="!isUserLoaded" class="col-md-8">
          <div class="card p-4">
            <div class="card-body text-center">
              <h1>Authenticating with accounts.cbd.int</h1>
              <fa :icon="['fas','circle-notch']" class="fa-spin fa-3x fa-fw" />
            </div>
          </div>
        </div>

        <div v-if="isUserLoaded && !$me.isAuthenticated" class="col-md-8">
          <div class="card-group">
            <div class="card p-4">
              <div class="card-body text-center">
                <h1>Login</h1>
                <p class="text-muted">
                  Sign in to your <img src="https://www.cbd.int/styles/ui/templates/cbd2011/images/logo-cbd-leaf-line.gif" style="max-height: 16px; margin-bottom: 5px;"> SCBD account. You will be redirected to accounts.cbd.int and back.
                </p>
                <div class="row">
                  <div class="col-12">
                    <button class="btn btn-primary btn-lg btn-block" @click="goToSCBDLogin()">
                      Login with your SCBD account
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card text-white bg-primary py-5 d-md-down-none" style="width: 44%">
              <div class="card-body text-center">
                <div>
                  <h2>Sign up</h2>
                  <p> Create a SCBD account at accounts.cbd.int.</p>
                  <button class="btn btn-primary btn-lg  active mt-3" @click="goToSCBDSignUp()">
                    Register Now!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name   : 'Login',
  layout : 'login',
  data,
  mounted,
  methods: { goToSCBDLogin, goToSCBDSignUp, authenticate }
}

function data (){
  const isUserLoaded = false

  return { isUserLoaded }
}

function mounted (){
  this.$root.$on('$me', this.authenticate)
}

function authenticate (e){
  this.$forceUpdate()

  this.isUserLoaded = true
  if (!this.$me.isAuthenticated) return

  const { returnUrl } = this.$route.query

  if (returnUrl) return this.$router.push(returnUrl)

  this.$router.push('/')
}

function goToSCBDLogin (){
  const returnUrl = window.location.href

  window.location.href = this.$auth.accountsUrl + `?returnUrl=${returnUrl}`
}

function goToSCBDSignUp (){
  const returnUrl = window.location.href

  window.location.href = `${this.$auth.accountsUrl}/signup` + `?returnUrl=${returnUrl}`
}

</script>
