/*
    1. По умолчанию пишем три значащих цифры. То есть если число порядка единиц, то до сотых долей; если порядка десятков, то до десятых: 1,15 А, 86,9 %.
    Если число порядка десятых, то до тысячных: 0,654 А.
    Если сотни, то 230 В, 218 В и т.п.
    2. Если меньше 0,1, то в стандартном виде: 2,82*10^-2
    3. Однако, если число в процентах, то пишем строго до десятых долей: 100,0%, 65,4%, 0,1%. 
    Потому что в процентах мы измеряем разного рода расхождения и несимметричности, и если они на уровне 0,1%, то в них нет большого смысла. 
    То есть число меньше 0,05% - можем спокойно округлять до 0,0% и писать 0,0%.
    4. Если число больше 1000, то писать в стандартном виде, сохраняя три значащих цифры: 4,52*10^3 Вт, 4,52*10^5 Вт, 1,23*10^-5 Вт.
*/

import { describe, it, expect } from 'vitest'
import { NumberFormatUtils } from '../src/numberFormatUtils'

describe('Передаем неподходящие значения', () => {
    it('Когда не переданы параметры, вернуть пустую строку', () => {
        expect(NumberFormatUtils.toStandartFormString()).toBe('')
    })

    it('null -> "". Когда передан null, вернуть пустую строку', () => {
        expect(NumberFormatUtils.toStandartFormString(null)).toBe('')
    })

    it('"" -> "". Когда передана пустая строка, вернуть пустую строку', () => {
        expect(NumberFormatUtils.toStandartFormString('')).toBe('')
    })

    it('"asdf" -> "". Когда передана некорректная строка, вернуть пустую строку', () => {
        expect(NumberFormatUtils.toStandartFormString('asdf')).toBe('')
    })

    it('new Date() -> "". Когда передана дата, вернуть пустую строку', () => {
        expect(NumberFormatUtils.toStandartFormString(new Date())).toBe('')
    })

    it('{} -> "". Когда передан объект, вернуть пустую строку', () => {
        expect(NumberFormatUtils.toStandartFormString({})).toBe('')
    })

    it('"-2,16" -> "". Когда разделитель в строке не равен точке, вернуть пустую строку', () => {
        expect(NumberFormatUtils.toPercentageString('-2,16')).toBe('')
    })
})

describe('Передаем корректные значения в виде строки', () => {
    it('0 -> "0.00". Число равно нулю, вернуть ноль - 0', () => {
        expect(NumberFormatUtils.toStandartFormString('0')).toBe('0.00')
    })
})

describe('Передаем корректные значения', () => {
    it('-2.16 -> "-2.16". Отрицательное число, вернуть число, округленное по банковским правилам в большую сторону', () => {
        expect(NumberFormatUtils.toStandartFormString(-2.16)).toBe('-2.16')
    })


    it('0 -> "0.00". Число равно нулю, вернуть ноль - 0', () => {
        expect(NumberFormatUtils.toStandartFormString(0)).toBe('0.00')
    })


    it('-12345 -> "1.23×10^4". Число < 1000, вернуть в стандартном виде', () => {
        expect(NumberFormatUtils.toStandartFormString(-12345)).toBe('-1.23×10^4')
    })

    it('12345 -> "1.23×10^4". Число > 1000, вернуть в стандартном виде', () => {
        expect(NumberFormatUtils.toStandartFormString(12345)).toBe('1.23×10^4')
    })

    it('1000 -> "1×10^3". Число = 1000, вернуть в стандартном виде', () => {
        expect(NumberFormatUtils.toStandartFormString(1000)).toBe('1×10^3')
    })

    it('999.99 -> "1×10^3". Число менее 1000 на 0.01, вернуть в стандартном виде', () => {
        expect(NumberFormatUtils.toStandartFormString(999.99)).toBe('1×10^3')
    })


    it('123.45 -> "123". Число > 100, вернуть целое число', () => {
        expect(NumberFormatUtils.toStandartFormString(123.45)).toBe('123')
    })

    it('100 -> "100". Число = 100, вернуть целое число', () => {
        expect(NumberFormatUtils.toStandartFormString(100)).toBe('100')
    })

    it('99.99 -> "100". Число менее 100 на 0.01, вернуть целое число', () => {
        expect(NumberFormatUtils.toStandartFormString(99.99)).toBe('100')
    })


    it('12.345 -> "12.3". Число > 10, вернуть десятичное число с одним знаком после запятой', () => {
        expect(NumberFormatUtils.toStandartFormString(12.345)).toBe('12.3')
    })

    it('12.000 -> "12.0". Число > 10, вернуть десятичное число с одним знаком после запятой', () => {
        expect(NumberFormatUtils.toStandartFormString(12.000)).toBe('12.0')
    })

    it('10 -> "10.0". Число = 10, вернуть десятичное число с одним знаком после запятой', () => {
        expect(NumberFormatUtils.toStandartFormString(10)).toBe('10.0')
    })

    it('9.99 -> "10.0". Число менее 10 на 0.01, вернуть десятичное число с одним знаком после запятой', () => {
        expect(NumberFormatUtils.toStandartFormString(9.99)).toBe('10.0')
    })


    it('1.2345 -> "1.23". Число > 1, вернуть десятичное число с двумя знаками после запятой', () => {
        expect(NumberFormatUtils.toStandartFormString(1.2345)).toBe('1.23')
    })

    it('1.2000 -> "1.20". Число > 1, вернуть десятичное число с двумя знаками после запятой', () => {
        expect(NumberFormatUtils.toStandartFormString(1.2000)).toBe('1.20')
    })

    it('1 -> "1.00". Число = 1, вернуть десятичное число с двумя знаками после запятой', () => {
        expect(NumberFormatUtils.toStandartFormString(1)).toBe('1.00')
    })

    it('0.99 -> "1.00". Число менее 1 на 0.01, вернуть десятичное число с двумя знаками после запятой', () => {
        expect(NumberFormatUtils.toStandartFormString(0.99)).toBe('1.00')
    })


    it('0.12345 -> "0.123". Число > 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
        expect(NumberFormatUtils.toStandartFormString(0.123)).toBe('0.123')
    })

    it('0.10000 -> "0.100". Число > 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
        expect(NumberFormatUtils.toStandartFormString(0.10000)).toBe('0.100')
    })

    it('0.1 -> "0.100". Число = 0.1, вернуть десятичное число с тремя знаками после запятой', () => {
        expect(NumberFormatUtils.toStandartFormString(0.1)).toBe('0.100')
    })

    it('0.09 -> "0.100". Число менее 0.1 на 0.01, вернуть десятичное число с тремя знаками после запятой', () => {
        expect(NumberFormatUtils.toStandartFormString(0.09)).toBe('0.100')
    })


    it('0.012345 -> "1.23×10^-2". Число менее 0.1, вернуть в стандартном виде', () => {
        expect(NumberFormatUtils.toStandartFormString(0.012345)).toBe('1.23×10^-2')
    })
})
