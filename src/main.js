import { FormattedNumber, NumberFormatUtils } from './numberFormatUtils'

var input = document.querySelector('#number')
var formattedNumberNode = document.querySelector('#formatedNumber')
var formattedPercentageNode = document.querySelector('#formatedPercentage')

var mantissaNode = document.querySelector('#mantissa')
var multiplicationSignNode = document.querySelector('#multiplication-sign')
var baseNode = document.querySelector('#base')
var exponentNode = document.querySelector('#exponent')

input.addEventListener('input', () => {
  const formattedNumber = new FormattedNumber(input.value)
  formattedNumberNode.innerHTML = formattedNumber.toStringAsNumber()
  formattedPercentageNode.innerHTML = formattedNumber.toStringAsPercentage()

  mantissaNode.innerHTML = formattedNumber.mantissa.toString()

  if (formattedNumber.exponent !== '') {
    multiplicationSignNode.innerHTML = '×'
    baseNode.innerHTML = formattedNumber.base.toString()
    exponentNode.innerHTML = formattedNumber.exponent.toString()
  } else {
    multiplicationSignNode.innerHTML = ''
    baseNode.innerHTML = ''
    exponentNode.innerHTML = ''
  }

  console.log(NumberFormatUtils.toStandartFormString(input.value))
  console.log(NumberFormatUtils.toPercentageString(input.value))
  console.log(NumberFormatUtils.toStandartFormObject(input.value))
})
