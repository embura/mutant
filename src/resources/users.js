const axios = require('axios');
const log = require('../log');
const config = require('config');
const _ = require('lodash');

class Users {
  constructor(request = axios) {
    this.request = request;
  }
  
  async getUsers(){
    let response;
    const resourceUsersUrl = config.get('recourses.users.url');

    log.info('[Users] resourceUsersUrl %j:', resourceUsersUrl);
    try {                
        const { data } = await this.request.get(resourceUsersUrl);
        response = data;
    } catch (error) {
      const { status, data } = error.response;
      if (status == 404) {
        response = { error: data };
      } else {
        response = { error: 'Error' };
      }

      log.error('[UsersResource] error: ', error);
    }

    log.info('[UsersResource] getUsers - response: %j', response);
    response = await this.filter(response)
      .then( usersFilter => this.sortByNameEmailCompany(usersFilter))
      .then( usersSort => this.getUsersReducedDetails(usersSort))
      .catch (err => {
          log.info('[UsersResource] getUsers - err: ', err.message);
          return err;
      });
    
    return response;
  }

  getUsersReducedDetails(users){
    const userDetails =  users.map(user => {
      return {
        name: user.name,
        email: user.email,
        company: user.company,
        website: user.website
      }
    });

    log.info('[UsersResource] getUsersReducedDetails - userDetails: %j', userDetails);
    return userDetails;
  }

  async filter(users) {
    const userFiltered =  users.filter( user => /suite/i.test(user.address.suite));
    log.info('[UsersResource] filter -  userFiltered: %j', userFiltered);
    return userFiltered;
  }

  sortByNameEmailCompany(users){
    const userSorted =  _.orderBy(users, ['name', 'email', 'company.name'], ['asc', 'asc', 'asc']);
    log.info('[UsersResource] sortByNameEmailCompany -  userSorted: %j', userSorted);
    return userSorted;
  }

}

module.exports = Users;