import { describe, it, expect } from 'vitest'
import FormattingUtility from '../src/FormattingUtility'

describe('Передаем неподходящие значения', () => {
    it('Когда не переданы параметры, вернуть пустую строку', () => {
        expect(FormattingUtility.toStandartFormString()).toBe('')
    })

    it('null -> "". Когда передан null, вернуть пустую строку', () => {
        expect(FormattingUtility.toStandartFormString(null)).toBe('')
    })

    it('"" -> "". Когда передана пустая строка, вернуть пустую строку', () => {
        expect(FormattingUtility.toStandartFormString('')).toBe('')
    })

    it('"asdf" -> "". Когда передана некорректная строка, вернуть пустую строку', () => {
        expect(FormattingUtility.toStandartFormString('asdf')).toBe('')
    })

    it('new Date() -> "". Когда передана дата, вернуть пустую строку', () => {
        expect(FormattingUtility.toStandartFormString(new Date())).toBe('')
    })

    it('{} -> "". Когда передан объект, вернуть пустую строку', () => {
        expect(FormattingUtility.toStandartFormString({})).toBe('')
    })

    it('"-2,16" -> "". Когда разделитель в строке не равен точке, вернуть пустую строку', () => {
        expect(FormattingUtility.toPercentageString('-2,16')).toBe('')
    })
})

describe('Передаем корректные значения в виде строки', () => {
    it('0 -> "0.00". Число равно нулю, вернуть ноль - 0', () => {
        expect(FormattingUtility.toStandartFormString('0')).toBe('0.00')
    })
})

describe('Передаем корректные значения', () => {
    it('-2.16 -> "-2.16". Отрицательное число, вернуть число, округленное по банковским правилам в большую сторону', () => {
        expect(FormattingUtility.toStandartFormString(-2.16)).toBe('-2.16')
    })


    it('0 -> "0.00". Число равно нулю, вернуть ноль - 0', () => {
        expect(FormattingUtility.toStandartFormString(0)).toBe('0.00')
    })


    it('-12345 -> "1.23×10^4". Число < 1000, вернуть в стандартном виде', () => {
        expect(FormattingUtility.toStandartFormString(-12345)).toBe('-1.23×10^4')
    })

    it('12345 -> "1.23×10^4". Число > 1000, вернуть в стандартном виде', () => {
        expect(FormattingUtility.toStandartFormString(12345)).toBe('1.23×10^4')
    })

    it('1000 -> "1.00×10^3". Число = 1000, вернуть в стандартном виде', () => {
        expect(FormattingUtility.toStandartFormString(1000)).toBe('1.00×10^3')
    })

    it('999.99 -> "1.00×10^3". Число менее 1000 на 0.01, вернуть в стандартном виде', () => {
        expect(FormattingUtility.toStandartFormString(999.99)).toBe('1.00×10^3')
    })


    it('123.45 -> "123". Число > 100, вернуть целое число', () => {
        expect(FormattingUtility.toStandartFormString(123.45)).toBe('123')
    })

    it('100 -> "100". Число = 100, вернуть целое число', () => {
        expect(FormattingUtility.toStandartFormString(100)).toBe('100')
    })

    it('99.99 -> "100". Число менее 100 на 0.01, вернуть целое число', () => {
        expect(FormattingUtility.toStandartFormString(99.99)).toBe('100')
    })


    it('12.345 -> "12.3". Число > 10, вернуть десятичное число с одним знаком после запятой', () => {
        expect(FormattingUtility.toStandartFormString(12.345)).toBe('12.3')
    })

    it('12.000 -> "12.0". Число > 10, вернуть десятичное число с одним знаком после запятой', () => {
        expect(FormattingUtility.toStandartFormString(12.000)).toBe('12.0')
    })

    it('10 -> "10.0". Число = 10, вернуть десятичное число с одним знаком после запятой', () => {
        expect(FormattingUtility.toStandartFormString(10)).toBe('10.0')
    })

    it('9.999 -> "10.0". Число менее 10 на 0.001, вернуть десятичное число с одним знаком после запятой', () => {
        expect(FormattingUtility.toStandartFormString(9.999)).toBe('10.0')
    })


    it('1.2345 -> "1.23". Число > 1, вернуть десятичное число с двумя знаками после запятой', () => {
        expect(FormattingUtility.toStandartFormString(1.2345)).toBe('1.23')
    })

    it('1.2000 -> "1.20". Число > 1, вернуть десятичное число с двумя знаками после запятой', () => {
        expect(FormattingUtility.toStandartFormString(1.2000)).toBe('1.20')
    })

    it('1 -> "1.00". Число = 1, вернуть десятичное число с двумя знаками после запятой', () => {
        expect(FormattingUtility.toStandartFormString(1)).toBe('1.00')
    })

    it('0.9999 -> "1.00". Число менее 1 на 0.0001, вернуть десятичное число с двумя знаками после запятой', () => {
        expect(FormattingUtility.toStandartFormString(0.9999)).toBe('1.00')
    })


    it('0.12345 -> "0.123". Число > 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
        expect(FormattingUtility.toStandartFormString(0.123)).toBe('0.123')
    })

    it('0.10000 -> "0.100". Число > 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
        expect(FormattingUtility.toStandartFormString(0.10000)).toBe('0.100')
    })

    it('0.1 -> "0.100". Число = 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
        expect(FormattingUtility.toStandartFormString(0.1)).toBe('0.100')
    })

    it('0.0999 -> "0.100". Число менее 0.1 на 0.0001, вернуть десятичное число с тремя знаками после запятой', () => {
        expect(FormattingUtility.toStandartFormString(0.0999)).toBe('0.100')
    })


    it('0.012345 -> "1.23×10^-2". Число менее 0.1, вернуть в стандартном виде', () => {
        expect(FormattingUtility.toStandartFormString(0.012345)).toBe('1.23×10^-2')
    })
})
