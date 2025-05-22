/*
    1. По умолчанию пишем три значащих цифры. То есть если число порядка единиц, то до сотых долей; если порядка десятков, то до десятых: 1,15 А, 86,9 %.
    Если число порядка десятых, то до тысячных: 0,654 А.
    Если сотни, то 230 В, 218 В и т.п.
    2. Если меньше 0,1, то в стандартном виде: 2,82*10^-2
    3. Однако, если число в процентах, то пишем строго до десятых долей: 100,0%, 65,4%, 0,1%. 
    Потому что в процентах мы измеряем разного рода расхождения и несимметричности, и если они на уровне 0,1%, то в них нет большого смысла. 
    То есть число меньше 0,05% - можем спокойно округлять до 0,0% и писать 0,0%.
    4. Если число больше 1000, то писать в стандартном виде, сохраняя три значащих цифры: 4,52*10^3 Вт
*/

export class NumberFormatUtils {
    static toPercentageString(number) {
        const formattedNumber = new FormattedNumber(number)
        return formattedNumber.toStringAsPercentage()
    }

    static toStandartFormString(number) {
        const formattedNumber = new FormattedNumber(number)
        return formattedNumber.toStringAsNumber()
    }

    static toStandartFormObject(number) {
        return new FormattedNumber(number)
    }
}

export class FormattedNumber {
    rawValue = NaN

    #isCalculated = false
    #numericValue = null
    #sign = 1
    #mantissa = null
    #base = 10
    #exponent = 0

    get sign() {
        this.#ensureCalculate()
        return Math.sign(this.#sign) === -1 ? '-' : ''
    }

    get mantissa() {
        this.#ensureCalculate()

        if (this.#mantissa == null)
            return ''

        if (this.#exponent != 0)
            return this.#mantissa.toFixed(2)

        const roundedToIntMantissa = Math.round(this.#mantissa)

        if (roundedToIntMantissa >= 100)
            return this.#mantissa.toFixed(0)

        if (roundedToIntMantissa >= 10)
            return this.#mantissa.toFixed(1)

        if (roundedToIntMantissa >= 1)
            return this.#mantissa.toFixed(2)

        return this.#mantissa.toFixed(3)
    }

    get base() {
        this.#ensureCalculate()
        return this.#exponent !== 0 ? this.#base.toString() : ''
    }

    get exponent() {
        this.#ensureCalculate()
        return this.#exponent !== 0 ? this.#exponent.toString() : ''
    }

    constructor(value) {
        this.rawValue = value
    }

    #ensureCalculate() {
        try {
            if (!this.#isCalculated) {
                this.#calculateOrThrow()
            }
        } catch (error) {
            this.#mantissa = null
        } finally {
            this.#isCalculated = true
        }
    }

    #calculateOrThrow() {
        this.#numericValue = this.#getValidNumericValueOrThrow()

        const absValue = Math.abs(this.#numericValue)

        if (absValue === 0)
            this.#calculateSimpleStandartForm(this.#numericValue, 3)
        else if (absValue < 0.1 || absValue >= 1000)
            this.#calculateStandartForm(this.#numericValue)
        else if (absValue < 1)
            this.#calculateSimpleStandartForm(this.#numericValue, 3)
        else if (absValue < 10)
            this.#calculateSimpleStandartForm(this.#numericValue, 2)
        else if (absValue < 100)
            this.#calculateSimpleStandartForm(this.#numericValue, 1)
        else
            this.#calculateSimpleStandartForm(this.#numericValue, 0)
    }

    #getValidNumericValueOrThrow() {
        if (!isFinite(this.rawValue))
            throw new Error("Значение не может быть представлено числом")

        const numericValue = parseFloat(this.rawValue)

        if (isNaN(numericValue))
            throw new Error("Значение является NaN")

        return numericValue
    }

    #roundTo(value, decimalPlaces) {
        const multiplier = Math.pow(10, decimalPlaces)
        return Math.round(value * multiplier) / multiplier
    }

    #calculateStandartForm(value) {
        if (value === 0)
            throw new Error("Невозможно представить ноль в стандартном виде")

        const decimalPlaces = 2
        let absNum = Math.abs(value)    // возможно, здесь нужно округлить?
        let exponent = 0

        // Для чисел меньше 1
        if (absNum < 1) {
            while (absNum < 1) {
                absNum *= 10
                exponent--
            }
        } else {
            // Для чисел больше или равных 10
            while (absNum >= 10) {
                absNum /= 10
                exponent++
            }
        }

        this.#sign = Math.sign(value)
        this.#mantissa = this.#roundTo(absNum, decimalPlaces)
        this.#exponent = exponent
    }

    #calculateSimpleStandartForm(value, decimalPlaces = 0) {
        this.#sign = Math.sign(value)
        this.#mantissa = this.#roundTo(Math.abs(value), decimalPlaces)
    }

    toString() { return this.toStringAsNumber() }

    toStringAsPercentage() {
        try {
            this.#ensureCalculate()
            return this.#numericValue.toFixed(1)
        } catch (error) {
            return ''
        }
    }

    toStringAsNumber() {
        try {
            this.#ensureCalculate()
            if (this.#exponent === 0)
                return `${this.sign}${this.mantissa}`
            else
                return `${this.sign}${this.mantissa}×${this.base}^${this.exponent}`
        } catch (error) {
            return ''
        }
    }

    valueOf() {
        try {
            this.#ensureCalculate()
            return this.#numericValue
        } catch (error) {
            return NaN
        }
    }
}
