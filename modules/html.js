'use strict'

const rusMinus1 = require('/var/task/modules/r-u-s-minus-one.js')
const mark = rusMinus1.mark 

const html = {



    //  Priorities for (rus.html.form) :
    //
    //  -   Throw errors if critical attributes, etc. are missing.
    //  -   Automatically close tags.
    //  -   Reduce markup to be typed.
    //  -   Do not be more specific than necessary.
    //
    //  Design decisions:
    //
    //  -   (fieldset) is used arbitrarily; so it is left out here;
    //  -   (label) is often adjacent to its (id)-ed element, but this is
    //      also not necessary, so it is also left out here;
    //
    //


    form: async conf => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        conf = {

            /* defaults */
            method: 'POST',

            /* explicitly passed */
            ...conf
        }

        if (!conf.action) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.form) called, without (conf.action) `)
        }
        else
        if (!conf.innerHtml) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.form) called, without (conf.innerHtml) `)
        }

        const markup = `<form   method="${ conf.method }"
                                action="${ conf.action }"
                                ${ conf.id          ? `id="${conf.id}"`
                                                    : '' }
                                ${ conf.class       ? `class="${conf.class}"`
                                                    : '' }
                                ${ conf.onsubmit    ? `onsubmit="${conf.onsubmit}"`
                                                    : '' }
                                >
                                ${ conf.innerHtml }
                                </form>`

        rusMinus1.frameworkDescriptionLogger.callEnds()

        return markup
    },

    input: async conf => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        conf = {

            /* defaults */
            type: 'text',

            /* explicitly passed */
            ...conf
        }

        if ((!conf.name) && (!conf.type == 'submit')) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.input) called, without (conf.name) `)
        }
        else
        if (conf.labelInnerHtml && (!conf.id)) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.input) called, (conf.labelInnerHtml) without (conf.id)`)
        }

        const markup = ` ${  conf.labelInnerHtml 
                        ? `<label   for="${ conf.id }"
                                    > 
                                    ${ conf.labelInnerHtml }
                                    </label>` 
                        : ``
                    }
                    <input  ${ conf.type        ? `type="${conf.type}"`
                                                : '' }
                            ${ conf.form        ? `form="${conf.form}"`
                                                : ''
                            }
                            ${ conf.id          ? `id="${conf.id}"`
                                                : '' }
                            ${ conf.name        ? `name="${conf.name}"` 
                                                : '' }"
                            ${ conf.value       ? `value="${ conf.value }"` 
                                                : '' }
                            ${ conf.pattern     ? `pattern="${ conf.pattern }"` 
                                                : '' }
                            ${ conf.placeholder ? `placeholder="${conf.placeholder}"`
                                                : '' }
                            ${ conf.required    ? 'required'
                                                : '' }
                            ${ conf.readonly    ? `readonly`
                                                : '' }
                            ${ conf.disabled    ? `disabled`
                                                : '' }
                            >`

        rusMinus1.frameworkDescriptionLogger.callEnds()

        return markup
    },

    fieldset: async conf => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        if (!conf.innerHtml) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.legend) called, without (conf.InnerHtml)`)
        }

        const markup = `
            <fieldset
                ${ conf.disabled    ? `disabled`            
                                    : `` }
                ${ conf.form        ? `form="${conf.form}"`     
                                    : `` 
                    // "the id of a <form/> you want as this <fieldset/>'s parent even if the latter is not a DOM child of the former"
                }
                ${ conf.name        ? `name="${conf.name}"` 
                                    : `` }
                ${ conf.class       ? `class="${conf.class}"` 
                                    : `` }
            >
                ${  conf.legendInnerHtml 
                    ? `<legend>${conf.legendInnerHtml}</legend>`
                    : ``
                }
                
                ${ conf.innerHtml }
            </fieldset>`

        rusMinus1.frameworkDescriptionLogger.callEnds()

        return markup
    },
    select: conf => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        if (!conf.name) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.input) called, without (conf.name) `)
        }
        else
        if (conf.labelInnerHtml && (!conf.id)) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.input) called, (conf.labelInnerHtml) without (conf.id)`)
        }

        const defaults = {}

        const markup = ` ${  conf.label 
                                ? `<label   for="${ conf.id }"
                                            > 
                                            ${ conf.label }
                                            </label>` 
                                : ``
                            }
                            <select  name="${ conf.name }"
                                    ${ conf.id ? conf.id : '' }
                                    ${ conf.required ? 'required' : '' }
                            >
                                    
                                ${
                                    conf.options.map( o  => `
                                    
                                        <option value="${ o.value }"
                                        
                                        >
                                            ${ o.innerHtml }
                                        </option>
                                    
                                    ` )          
                                }
                                    
                            </select>`

        rusMinus1.frameworkDescriptionLogger.callEnds()

        return markup
    },

    //table: conf => {}  ,
    textarea: async conf => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        conf = {

            /* defaults */
            type: 'text',

            /* explicitly passed */
            ...conf
        }

        if (!conf.name) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.textarea) called, without (conf.name) `)
        }
        else
        if (conf.labelInnerHtml && (!conf.id)) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.textarea) called, (conf.labelInnerHtml) without (conf.id)`)
        }

        const markup = ` ${  conf.labelInnerHtml 
                        ? `<label   for="${ conf.id }"
                                    > 
                                    ${ conf.labelInnerHtml }
                                    </label>` 
                        : ``
                        
                        /* why do we have to repeat this for <input>/<textarea> etc.? FIXME */
                    }
                    <textarea   ${ conf.type        ? `type="${conf.type}"`
                                                    : '' }
                                ${ conf.form        ? `form="${conf.form}"`
                                                    : '' }
                                ${ conf.id          ? `id="${conf.id}"`
                                                    : '' }
                                ${ conf.name        ? `name="${conf.name}"` 
                                                    : '' }"
                                ${ conf.value       ? `value="${ conf.value }"` 
                                                    : '' }
                                ${ conf.placeholder ? `placeholder="${conf.placeholder}"`
                                                    : '' }
                                ${ conf.required    ? 'required'
                                                    : '' }
                                ${ conf.readonly    ? `readonly`
                                                    : '' }
                                ${ conf.onkeyup    ? `onkeyup="${  conf.onkeyup }"`
                                                    : '' }
                            ></textarea>`

        rusMinus1.frameworkDescriptionLogger.callEnds()

        return markup
    },


}

module.exports = html
mark(`~/modules/html.js LOADED`)
