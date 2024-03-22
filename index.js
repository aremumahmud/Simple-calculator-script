//example on how to stack operatins

function calculatorFactory(operation, [a, b], verbose) {

    //   console.log(operation, a, b)

    //validate the parameters first 
    //note the verbose options is just for debugging operation. nothing complicated trust me :)

    //if the second paramenter isnt an array

    if (arguments[1].constructor.name !== 'Array') return verbose ? {

        error: true,
        msg: 'invalid parameters, argument[1] i.e the array containing a and b, should be of type Array'

    } : false

    //if the operation given is a number return false
    if (!isNaN(operation)) return verbose ? {

        error: true,
        msg: 'invalid parameters, argument[0] i.e operation, should be of type String'

    } : false


    //if a and b arent numbers
    if (isNaN(a) || isNaN(b)) return verbose ? {

        error: true,
        msg: 'invalid parameters, both contents of the Array at argument[1] should only contain numbers'

    } : false


    //the logic of the factory


    if (operation === '+') return a + b
    if (operation === '-') return a - b
    if (operation === 'x' || operation === '*') return a * b
    if (operation === '/') return a / b


    //if the operation provided is non of the above we return false or a verbose message
    return verbose ? {

        error: true,
        msg: 'invalid/unsupported operation provided, should be part of [ + , - , x , * , /]'

    } : false
}





function separateOperationIntoQueue(operationString, verbose) {


    //first we validate the operation string
    if (!isNaN(operationString)) return verbose ? {

        error: true,
        msg: 'invalid parameters, argument[0] i.e operationString, should be of type String'

    } : false




    const queue = []
    let operationList = ['+', '-', 'x', '*', '/']
    let tempString = ''
    let operationStringArray = operationString.split('')
    let prematureProcess = 0
    let operationArrayLength = operationStringArray.length


    //if the sting ends or starts with an operator then it is invalid
    if (operationList.indexOf(operationStringArray[0]) !== -1 || operationList.indexOf(operationStringArray[operationArrayLength - 1]) !== -1) return []

    for (let i = 0; i < operationArrayLength; i++) {

        //if there is an operation that couldnt be processed we break out
        if (prematureProcess > 0) break

        if (operationList.indexOf(operationStringArray[i]) !== -1) {

            //if we find an operation we want to push the string in tempsting to the queue, but first we convert it to number

            let discovered_number = parseInt(tempString)


            //if the disovered number is not a number, it means we cant process it therefore terminate the operation on the next loop cycle 
            // by incrementing the prematureProcess variable
            isNaN(discovered_number) ? prematureProcess++ : queue.push(discovered_number)

            queue.push(operationStringArray[i])

            tempString = ''

        } else {
            tempString += operationStringArray[i]
        }

    }

    //if there was a premature process, then there is no need to check the tail
    if (prematureProcess > 0) {
        return []
    }


    //check if there is a residue at tempstring , add the residue at the tempstring, and also check if its valid
    if (tempString) {

        let discovered_tail_number = parseInt(tempString)

        isNaN(discovered_tail_number) ? prematureProcess++ : queue.push(discovered_tail_number)

    }


    return prematureProcess > 0 ? [] : queue

}


function implementPrecedence(operationArray, precedence_constraints_order = ['/', 'x', '*']) {


    const precedence_helper = (constraint, arr) => {
        let constraintIndex = arr.indexOf(constraint)
        if (constraintIndex < 0) {
            return arr
        }

        let result = []

        let preElement = constraintIndex - 1
        let postElement = constraintIndex + 1
        let isSlidedIn = false

        let resultingValue = calculatorFactory(constraint, [arr[preElement], arr[postElement]]) || 0


        arr.forEach((el, i) => {

            if (i === preElement || i === postElement || i === constraintIndex) {
                !isSlidedIn && result.push(resultingValue)

                isSlidedIn = true
                return
            }

            result.push(el)
        });

        return precedence_helper(constraint, result)

    }

    let result = [...operationArray]

    precedence_constraints_order.forEach(constraint => {
        result = precedence_helper(constraint, result)
    })

    return result
}




function executeOperationString(operationString) {

    let operationArray = separateOperationIntoQueue(operationString)

    //we check if it isnt false or the array length is greater than zero
    //if it doesnt meet these conditions we want to return false

    if (!(operationArray && operationArray.length > 0)) return false

    let operationArrayClone = [...operationArray]

    let precedence_constraints_ordered_operation = implementPrecedence(operationArrayClone)

    let calculate = (array, result = null) => {
        //  console.log(array)
        if (array.length < 1) {
            return result
        }

        let array_clone = [...array]
        let first_operand = result || array_clone.shift()


        let new_result = calculatorFactory(array_clone.shift(), [first_operand, array_clone.shift()])
            //   console.log(new_result)
        return calculate(array_clone, new_result)
    }

    return calculate(precedence_constraints_ordered_operation)



}

console.log(executeOperationString('8+4*1+1*6*3/5+2')) // 17.6 !!