'use strict'

const mark = require('/var/task/modules/mark.js')

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

        if (!conf.action) {
            throw Error(`(rus.html.form) called, without (conf.action) `)
        }
        else
        if (!conf.innerHtml) {
            throw Error(`(rus.html.form) called, without (conf.innerHtml) `)
        }

        const defaults = {
            method: 'POST'
        }

        const markup = `<form   method="${ conf.method ? conf.method : defaults.method }"
                                action="${ conf.action }"
                                class="${ conf.class }"
                                id="${ conf.id ? conf.id : `` }"
                                >
                                ${ conf.innerHtml }
                                </form>`
        return markup
    },

    input: async conf => {

        if ((!conf.name) && (!conf.type == 'submit')) {
            throw Error(`(rus.html.input) called, without (conf.name) `)
        }
        else
        if (conf.labelInnerHtml && (!conf.id)) {
            throw Error(`(rus.html.input) called, (conf.labelInnerHtml) without (conf.id)`)
        }

        const defaults = {
            type: 'text'
        }

        const markup = ` ${  conf.label 
                        ? `<label   for="${ conf.id }"
                                    > 
                                    ${ conf.label }
                                    </label>` 
                        : ``
                    }
                    <input  type="${ conf.type ? conf.type : defaults.type }"
                            ${ conf.type        ? `type="${conf.type}"`
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
                                                : ''
                            }
                            >`

        return markup
    },

    fieldset: async conf => {

        if (!conf.innerHtml) {
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
            >
                ${  conf.legendInnerHtml 
                    ? `<legend>${conf.legendInnerHtml}</legend>`
                    : ``
                }
                
                ${ conf.innerHtml }
            </fieldset>`

        return markup
    }
    /*        
            select : conf => {
                
                if ( ! conf.name ) {
                    throw Error (`(rus.html.input) called, without (conf.name) `)
                }
                else
                if ( conf.labelInnerHtml && ( ! conf.id ) ) {
                    throw Error (`(rus.html.input) called, (conf.labelInnerHtml) without (conf.id)`)
                }
                
                const defaults = {
                    type: 'text'
                }
                
                const markup 
                    = ` ${  conf.label 
                            ? `<label   for="${ conf.id }"
                                        > 
                                        ${ conf.label }
                                        </label>` 
                            : ``
                        }
                        <input  type="${ conf.type ? conf.type : defaults.type }"
                                name="${ conf.name }"
                                ${ conf.placeholder ? conf.placeholder : '' }
                                ${ conf.id ? conf.id : '' }
                                ${ conf.required ? 'required' : '' }
                                >`
                                
                return markup
            },

            table : conf => {
            }

    */
}

module.exports = html
mark(`~/modules/html.js LOADED`)
