'use strict'

const rusMinus1 = require('/var/task/modules/r-u-s-minus-1.js')
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


    form: async _conf => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        _conf = {

            /* defaults */
            method: 'POST',

            /* explicitly passed */
            ..._conf
        }

        if (!_conf.action) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.form) called, without (_conf.action) `)
        }
        else
        if (!_conf.innerHtml) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.form) called, without (_conf.innerHtml) `)
        }

        const markup = `<form   method="${ _conf.method }"
                                action="${ _conf.action }"
                                ${ _conf.id          ? `id="${_conf.id}"`
                                                    : '' }
                                ${ _conf.class       ? `class="${_conf.class}"`
                                                    : '' }
                                ${ _conf.onsubmit    ? `onsubmit="${_conf.onsubmit}"`
                                                    : '' }
                                >
                                ${ _conf.innerHtml }
                                </form>`

        rusMinus1.frameworkDescriptionLogger.callEnds()

        return markup
    },

    input: async _conf => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        _conf = {

            /* defaults */
            type: 'text',

            /* explicitly passed */
            ..._conf
        }

        if ((!_conf.name) && (!_conf.type == 'submit')) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.input) called, without (_conf.name) `)
        }
        else
        if (_conf.labelInnerHtml && (!_conf.id)) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.input) called, (_conf.labelInnerHtml) without (_conf.id)`)
        }

        const markup = ` ${  _conf.labelInnerHtml 
                        ? `<label   for="${ _conf.id }"
                                    > 
                                    ${ _conf.labelInnerHtml }
                                    </label>` 
                        : ``
                    }
                    <input  ${ _conf.type        ? `type="${_conf.type}"`
                                                : '' }
                            ${ _conf.form        ? `form="${_conf.form}"`
                                                : ''
                            }
                            ${ _conf.id          ? `id="${_conf.id}"`
                                                : '' }
                            ${ _conf.name        ? `name="${_conf.name}"` 
                                                : '' }"
                            ${ _conf.value       ? `value="${ _conf.value }"` 
                                                : '' }
                            ${ _conf.pattern     ? `pattern="${ _conf.pattern }"` 
                                                : '' }
                            ${ _conf.placeholder ? `placeholder="${_conf.placeholder}"`
                                                : '' }
                            ${ _conf.required    ? 'required'
                                                : '' }
                            ${ _conf.readonly    ? `readonly`
                                                : '' }
                            ${ _conf.disabled    ? `disabled`
                                                : '' }
                            >`

        rusMinus1.frameworkDescriptionLogger.callEnds()

        return markup
    },

    fieldset: async _conf => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        if (!_conf.innerHtml) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.legend) called, without (_conf.InnerHtml)`)
        }

        const markup = `
            <fieldset
                ${ _conf.disabled    ? `disabled`            
                                    : `` }
                ${ _conf.form        ? `form="${_conf.form}"`     
                                    : `` 
                    // "the id of a <form/> you want as this <fieldset/>'s parent even if the latter is not a DOM child of the former"
                }
                ${ _conf.name        ? `name="${_conf.name}"` 
                                    : `` }
                ${ _conf.class       ? `class="${_conf.class}"` 
                                    : `` }
            >
                ${  _conf.legendInnerHtml 
                    ? `<legend>${_conf.legendInnerHtml}</legend>`
                    : ``
                }
                
                ${ _conf.innerHtml }
            </fieldset>`

        rusMinus1.frameworkDescriptionLogger.callEnds()

        return markup
    },
    select: _conf => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        if (!_conf.name) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.input) called, without (_conf.name) `)
        }
        else
        if (_conf.labelInnerHtml && (!_conf.id)) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.input) called, (_conf.labelInnerHtml) without (_conf.id)`)
        }

        const defaults = {}

        const markup = ` ${  _conf.label 
                                ? `<label   for="${ _conf.id }"
                                            > 
                                            ${ _conf.label }
                                            </label>` 
                                : ``
                            }
                            <select  name="${ _conf.name }"
                                    ${ _conf.id ? _conf.id : '' }
                                    ${ _conf.required ? 'required' : '' }
                            >
                                    
                                ${
                                    _conf.options.map( o  => `
                                    
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

    //table: _conf => {}  ,
    textarea: async _conf => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        _conf = {

            /* defaults */
            type: 'text',

            /* explicitly passed */
            ..._conf
        }

        if (!_conf.name) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.textarea) called, without (_conf.name) `)
        }
        else
        if (_conf.labelInnerHtml && (!_conf.id)) {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(rus.html.textarea) called, (_conf.labelInnerHtml) without (_conf.id)`)
        }

        const markup = ` ${  _conf.labelInnerHtml 
                        ? `<label   for="${ _conf.id }"
                                    > 
                                    ${ _conf.labelInnerHtml }
                                    </label>` 
                        : ``
                        
                        /* why do we have to repeat this for <input>/<textarea> etc.? FIXME */
                    }
                    <textarea   ${ _conf.type        ? `type="${_conf.type}"`
                                                    : '' }
                                ${ _conf.form        ? `form="${_conf.form}"`
                                                    : '' }
                                ${ _conf.id          ? `id="${_conf.id}"`
                                                    : '' }
                                ${ _conf.name        ? `name="${_conf.name}"` 
                                                    : '' }"
                                ${ _conf.value       ? `value="${ _conf.value }"` 
                                                    : '' }
                                ${ _conf.placeholder ? `placeholder="${_conf.placeholder}"`
                                                    : '' }
                                ${ _conf.required    ? 'required'
                                                    : '' }
                                ${ _conf.readonly    ? `readonly`
                                                    : '' }
                                ${ _conf.onkeyup    ? `onkeyup="${  _conf.onkeyup }"`
                                                    : '' }
                            ></textarea>`

        rusMinus1.frameworkDescriptionLogger.callEnds()

        return markup
    },


}

module.exports = html
mark('LOADED')