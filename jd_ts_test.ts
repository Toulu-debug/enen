import * as dotenv from 'dotenv';

dotenv.config()

let CFD_HELP_HW: string | boolean = process.env.CFD_HELP_HW ? process.env.CFD_HELP_HW : false;
console.log('财富岛助力HelloWorld:', CFD_HELP_HW)

let CFD_HELP_POOL: boolean | string = process.env.CFD_HELP_POOL ? process.env.CFD_HELP_POOL : true;
console.log('财富岛帮助助力池:', CFD_HELP_POOL)
