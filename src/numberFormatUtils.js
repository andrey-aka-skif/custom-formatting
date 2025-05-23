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


/**
 * Форматирование чисел для отображения в интерфейсе
 */
export class NumberFormatUtils {
    static toPercentageString(number) {
        const percentagesString = new FormattedPercentage(number)
        return percentagesString.toString()
    }

    static toStandartFormString(number) {
        const formattedNumber = new FormattedNumber(number)
        return formattedNumber.toString()
    }

    static toStandartFormObject(number) {
        const formattedNumber = new FormattedNumber(number)
        return formattedNumber.toObjectValue()
    }
}


/**
 * Базовый класс форматированных чисел
 */
class BaseFormattedValue {
    rawValue = NaN
    numericValue = NaN

    _isCalculated = false

    constructor(value) {
        if (new.target === BaseFormattedValue)
            throw new Error('BaseFormattedValue нельзя инстанцировать напрямую')

        this.rawValue = value
    }

    _ensureCalculateOrThrow() {
        if (!this._isCalculated) {
            this.numericValue = this._getValidNumericValueOrThrow()
            this._calculateOrThrow()
        }
        this._isCalculated = true
    }

    _getValidNumericValueOrThrow() {
        if (!isFinite(this.rawValue))
            throw new Error("Значение не может быть представлено числом")

        const numericValue = parseFloat(this.rawValue)

        if (isNaN(numericValue))
            throw new Error("Значение является NaN")

        return numericValue
    }

    _calculateOrThrow() { throw new Error('Метод не переопределён') }
}


/**
 * Форматированный процент
 */
class FormattedPercentage extends BaseFormattedValue {
    _calculateOrThrow() { }

    toString() {
        try {
            this._ensureCalculateOrThrow()
            return this.numericValue.toFixed(1)
        } catch (error) {
            return ''
        }
    }
}


/**
 * Форматированное число
 */
class FormattedNumber extends BaseFormattedValue {
    #sign = null
    #mantissa = null
    #decimalPlaces = Infinity
    #base = null
    #exponent = null

    _calculateOrThrow() {
        const absValue = Math.abs(this.numericValue)

        if (absValue === 0)
            this.#calculateSimpleStandartForm(this.numericValue, 3)
        else if (absValue < 0.1 || absValue >= 1000)
            this.#calculateStandartForm(this.numericValue)
        else if (absValue < 1)
            this.#calculateSimpleStandartForm(this.numericValue, 3)
        else if (absValue < 10)
            this.#calculateSimpleStandartForm(this.numericValue, 2)
        else if (absValue < 100)
            this.#calculateSimpleStandartForm(this.numericValue, 1)
        else
            this.#calculateSimpleStandartForm(this.numericValue, 0)
    }

    #calculateStandartForm(value) {
        if (value === 0)
            throw new Error("Невозможно представить ноль в стандартном виде")

        let absNum = Math.abs(value)
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
        this.#mantissa = Math.abs(absNum)
        this.#decimalPlaces = 2
        this.#base = 10
        this.#exponent = exponent
    }

    #calculateSimpleStandartForm(value, decimalPlaces = 0) {
        this.#sign = Math.sign(value)
        this.#mantissa = Math.abs(value)
        this.#decimalPlaces = decimalPlaces
    }

    toObjectValue() {
        try {
            this._ensureCalculateOrThrow()
            return {
                sign: Math.sign(this.#sign) === -1 ? '-' : '',
                mantissa: this.#mantissa !=0 ? this.#mantissa.toFixed(this.#decimalPlaces) : this.#mantissa.toFixed(2),
                base: this.#base ? '10' : '',
                exponent: this.#exponent ? this.#exponent.toString() : '',
            }
        } catch (error) {
            return {
                sign: '',
                mantissa: '',
                base: '',
                exponent: '',
            }
        }
    }

    toValue() { return this.numericValue }

    toString() {
        var objectValue = this.toObjectValue()

        if (!objectValue.mantissa)
            return ''

        if(objectValue.mantissa == 0)
            return '0.00'

        if (!objectValue.base || !objectValue.exponent)
            return `${objectValue.sign}${objectValue.mantissa}`

        return `${objectValue.sign}${objectValue.mantissa}×${objectValue.base}^${objectValue.exponent}`
    }
}
