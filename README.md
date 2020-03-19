# Kronos Web Dashboard

Kronos front end - Conference Registration System for the SCBD

[logo]:https://www.cbd.int/styles/ui/templates/cbd2011/images/logo-cbd-leaf-line.gif
[logoText]:https://www.cbd.int/styles/ui/templates/cbd2011/images/logo-cbd-text-en.gif


### Build Setup

#### install dependencies
``` bash
$ yarn install
```

#### Set environment variable settings
Export following dev enviroment variable OR Create a `.env` file in the root of your project folder an copy past them in.  
```
NUXT_ENV_API=https://api.cbddev.xyz
NUXT_ENV_KRONOS_API=https://kronos.cbddev.xyz
```

#### Starter the projects

``` bash
# serve with hot reload at localhost:3000
$ yarn dev

```



### @scbd/nuxt-scbd-sso-module

``` js

this.logOut()<void> //global method to log user our and clear stores of data.

this.$me = { UserID, Title, FirstName, LastName, Designation, Department, Organization, Address, Address2, City, State, Country, Zip, Phone, Fax, Email, EmailsCc, Government, UserGroup, TimeZoneID, IsEmailVerified, UserGroups, isAdmin, isStaff, isGov}

this.$me.hasRole('someRoleToTest') <Boolean>

this.$auth.isAuthLoaded() <Promise>
this.$auth.token <String>
this.$auth.accountsUrl <String>
this.$auth.baseReqOpts <Object> // { headers: { Authorization: 'Ticket AKJSHDAHSKHDASKDAJKHSD....' }}

```
### Route protection
To add protection onto a route simply add the auth property.

``` js

export default {
  name      : 'Contacts',
  auth      : ['ROLE_USER_MUST_HAVE']
}

```

### @nuxt/http
#### https://http.nuxtjs.org/
``` js
this.$http.$get
this.$http.$put
this.$http.$post
this.$http.$delete
```

# Main Dependency references

## bootstrap 4 base
  https://getbootstrap.com/docs/4.0/getting-started/introduction/

## template header, footer, sidebar and CIcon
  https://coreui.io/vue/docs/introduction/ 

## data table
 https://bootstrap-vue.js.org/docs/components/table

## searchable select box
  https://vue-multiselect.js.org/#sub-getting-started

## luxon for date formating
  https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-method-toFormat

## to add new font awsome icons
https://github.com/scbd/kronos-web/blob/master/configs/fa.js
https://fontawesome.com/icons?d=gallery&s=regular,solid&m=free


# Style Instructions

1. do not use a components from the libs above for simply styleing.  We have years of familiarity with bootstrap and prefer not to learn component new api's in order to produce what we know with css already.

