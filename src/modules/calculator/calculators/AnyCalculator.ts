import ComplexCalculator from "./ComplexCalculator";
import MatrixCalculator from "./MatrixCalculator";
import RealCalculator from "./RealCalculator";
import VectorCalculator from "./VectorCalculator";

type AnyCalculator = RealCalculator | ComplexCalculator | VectorCalculator | MatrixCalculator;

export default AnyCalculator;