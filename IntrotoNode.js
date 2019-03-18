// intro to node

//1995 - created
// node runtime tool for javascript - doesnt haven to run insode the browser
// V8 engine - what google uses

// execution context - a place where code is run/executed
    // global execution context - first thing that happens when you run node

  //  <<<<<<<<<<<<<<<<< breakdown >>>>>>>>>>>>>>>>>>>
//Call stack - global execution called
         // Thread - assignments/complicated operations/function calls/local execution context
                 // variable/memory/envirpnment - in the background

 /* Call Stack           Thread             Variables/Memory/Env 
                                                const names
                                                functions stored
- see evernote
*/

// call to a function is a call to a local execution context

// Example 1
const nums =[45,567,567];
function makegreeting (name){
    const greeting = 'hello' + name;
    return greeting
}

const myName = 'Mitch'
const message = makegreeting(myName);

// be careful with scope/parametrer names

// Example 2

// Global exe context
// global memory
const nums = [3456,567,567] // nums stored in memory

function squaredNums (num){ //record in global mem function but not read
    return num ** 2
}

const result = squaredNums(nums[1]) // result stored as undefined in global memory
    // local execution context created for squarednums 
    // call stack made to squared nums 
    // local execution made in thread
        // parameter assigned is stored in local on thread
        // fucntion is read and return
        // passed back to global mem and stored 
        // remove local execution context
    // call stack squared nums removed
    
    // result is stored
