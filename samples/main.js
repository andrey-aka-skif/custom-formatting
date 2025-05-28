import FormattingUtility from '../src/FormattingUtility'

var input = document.querySelector('#number')
var formattedNumberNode = document.querySelector('#formatedNumber')
var formattedPercentageNode = document.querySelector('#formatedPercentage')

var mantissaNode = document.querySelector('#mantissa')
var multiplicationSignNode = document.querySelector('#multiplication-sign')
var baseNode = document.querySelector('#base')
var exponentNode = document.querySelector('#exponent')

input.addEventListener('input', () => {
  const percentagesString = FormattingUtility.toPercentageString(input.value)
  const numberString = FormattingUtility.toStandartFormString(input.value)
  const numberOnject = FormattingUtility.toStandartFormObject(input.value)

  formattedNumberNode.innerHTML = numberString
  formattedPercentageNode.innerHTML = percentagesString

  mantissaNode.innerHTML = numberOnject.mantissa

  if (numberOnject.exponent !== '') {
    multiplicationSignNode.innerHTML = '×'
    baseNode.innerHTML = numberOnject.base
    exponentNode.innerHTML = numberOnject.exponent
  } else {
    multiplicationSignNode.innerHTML = ''
    baseNode.innerHTML = ''
    exponentNode.innerHTML = ''
  }
})
