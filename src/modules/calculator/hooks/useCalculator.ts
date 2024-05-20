import React from "react";
import { EOperand } from "../calculators/ICalculator";
import Calculator from "../Calculator";

export default function useCalculator(
    refA: React.RefObject<HTMLTextAreaElement>,
    refB: React.RefObject<HTMLTextAreaElement>,
    refC: React.RefObject<HTMLTextAreaElement>
): (operand: EOperand) => void {
    const calc = new Calculator();
    (operand: EOperand) => {
        if (refA && refB && refC) {
            const A = refA.current?.value || '';
            const B = refB.current?.value || '';
            if (operand === EOperand.prod || operand === EOperand.pow) {
                refC.current.value = calc[operand](
                    calc.getValue(A),
                    parseFloat(B))?.toString() || '';
                return;
            }
            refC.current.value = calc[operand](
                calc.getValue(A),
                calc.getValue(B))?.toString() || '';
        }
    }
}
