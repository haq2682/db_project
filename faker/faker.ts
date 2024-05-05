import firstNames from './firstNames';
import lastNames from './lastNames';

const Faker = {
    randomInteger: (min:number, max:number):number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    firstName: ():string => {
        return firstNames[Math.floor(Math.random() * firstNames.length)];
    },
    lastName: ():string => {
        return lastNames[Math.floor(Math.random() * lastNames.length)];
    },
    email: ():string => {
        const domains:string[] = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'mail.com', 'msn.com'];
        const email:string = `${firstNames[Math.floor(Math.random() * firstNames.length)]}${Math.floor(Math.random()*10000)}@${domains[Math.floor(Math.random() * domains.length)]}`;
        return email;
    },
    contactNumber: ():string => {
        let phoneNumber:string = '+';
        const countryCode:number = Math.floor(Math.random() * (100 - 1) + 1);
        phoneNumber += countryCode.toString();
        const digits:number = 12 - countryCode.toString().length;
        for(let i = 0; i < digits; i++) {
            const digit:number = Math.floor(Math.random() * 10);
            phoneNumber += digit.toString();
        }
        return phoneNumber;
    },
    date: (startDate:Date, endDate:Date): Date => {
        const startTime = startDate.getTime();
        const endTime = endDate.getTime();
        const randomTime = startTime + Math.random() * (endTime - startTime);
        return new Date(randomTime);
    },
    randomString: ():string => {
        let length:number = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
        const characters:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result:string = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },
    address: ():string => {
        const streetNames:string[] = ['Main St', 'Elm St', 'Oak St', 'Maple Ave', 'Cedar Ln'];
        const cities:string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
        const states:string[] = ['NY', 'CA', 'IL', 'TX', 'AZ'];
        const postalCode:number = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

        const randomStreet:string = streetNames[Math.floor(Math.random() * streetNames.length)];
        const randomCity:string = cities[Math.floor(Math.random() * cities.length)];
        const randomState:string = states[Math.floor(Math.random() * states.length)];

        return `${randomStreet}, ${randomCity}, ${randomState} ${postalCode}`;
    },
    username: ():string => {
        return `${lastNames[Math.floor(Math.random() * lastNames.length)]}${Math.floor(Math.random()*10000)}`;
    }
}

export default Faker;