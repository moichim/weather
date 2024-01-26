type PossibleNumericalValues = string|undefined|number

export default class GoogleProviderUtils {

    public static sanitizeNumericalValueRequired( value: PossibleNumericalValues ): number {
        return GoogleProviderUtils.sanitizeNumericalValue( value ) !
    }

    /**
     * Makes sure the value is a valid number or undefined
     */
    public static sanitizeNumericalValue( value: PossibleNumericalValues ) {

        if ( typeof value === "string" ) {

            // Make sure the string has a valid format
            value = value.replaceAll( ",", "." );

            const parsedFloat = parseFloat( value );

            return isNaN( parsedFloat ) 
                ? undefined 
                : parsedFloat;

        } else if ( typeof value === undefined ) {
            return undefined;
        }

        return value;

    }

    /** @deprecated should not be used */
    public static isValidNumericalValue( value: PossibleNumericalValues ) {

        if ( typeof value === "number" ) return true;
        else if ( value === undefined ) return false;
        return GoogleProviderUtils.sanitizeNumericalValue( value ) !== undefined;
    }

}