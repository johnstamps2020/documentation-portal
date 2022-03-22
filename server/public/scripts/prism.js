export function loadPrism() {
  /* PrismJS 1.27.0
https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript+apacheconf+aspnet+awk+bash+c+csharp+cpp+css-extras+csv+docker+ejs+git+graphql+http+hsts+ignore+ini+io+java+javadoc+javadoclike+javastacktrace+jolie+jsdoc+js-extras+json+json5+jsonp+jsstacktrace+js-templates+kotlin+less+makefile+markdown+markup-templating+nginx+powershell+python+jsx+tsx+regex+sass+scss+shell-session+sql+toml+typescript+xml-doc+yaml&plugins=line-numbers */
  /// <reference lib="WebWorker"/>

  var _self =
      typeof window !== 'undefined'
          ? window // if in browser
          : typeof WorkerGlobalScope !== 'undefined' &&
          self instanceof WorkerGlobalScope
              ? self // if in worker
              : {}; // if in node js

  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   */
  var Prism = (function (_self) {
    // Private helper vars
    var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
    var uniqueId = 0;

    // The grammar object for plaintext
    var plainTextGrammar = {};

    var _ = {
      /**
       * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
       * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
       * additional languages or plugins yourself.
       *
       * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
       *
       * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.manual = true;
       * // add a new <script> to load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      manual: _self.Prism && _self.Prism.manual,
      /**
       * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
       * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
       * own worker, you don't want it to do this.
       *
       * By setting this value to `true`, Prism will not add its own listeners to the worker.
       *
       * You obviously have to change this value before Prism executes. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.disableWorkerMessageHandler = true;
       * // Load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      disableWorkerMessageHandler:
          _self.Prism && _self.Prism.disableWorkerMessageHandler,

      /**
       * A namespace for utility methods.
       *
       * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
       * change or disappear at any time.
       *
       * @namespace
       * @memberof Prism
       */
      util: {
        encode: function encode(tokens) {
          if (tokens instanceof Token) {
            return new Token(tokens.type, encode(tokens.content), tokens.alias);
          } else if (Array.isArray(tokens)) {
            return tokens.map(encode);
          } else {
            return tokens
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/\u00a0/g, ' ');
          }
        },

        /**
         * Returns the name of the type of the given value.
         *
         * @param {any} o
         * @returns {string}
         * @example
         * type(null)      === 'Null'
         * type(undefined) === 'Undefined'
         * type(123)       === 'Number'
         * type('foo')     === 'String'
         * type(true)      === 'Boolean'
         * type([1, 2])    === 'Array'
         * type({})        === 'Object'
         * type(String)    === 'Function'
         * type(/abc+/)    === 'RegExp'
         */
        type: function (o) {
          return Object.prototype.toString.call(o).slice(8, -1);
        },

        /**
         * Returns a unique number for the given object. Later calls will still return the same number.
         *
         * @param {Object} obj
         * @returns {number}
         */
        objId: function (obj) {
          if (!obj['__id']) {
            Object.defineProperty(obj, '__id', {value: ++uniqueId});
          }
          return obj['__id'];
        },

        /**
         * Creates a deep clone of the given object.
         *
         * The main intended use of this function is to clone language definitions.
         *
         * @param {T} o
         * @param {Record<number, any>} [visited]
         * @returns {T}
         * @template T
         */
        clone: function deepClone(o, visited) {
          visited = visited || {};

          var clone;
          var id;
          switch (_.util.type(o)) {
            case 'Object':
              id = _.util.objId(o);
              if (visited[id]) {
                return visited[id];
              }
              clone = /** @type {Record<string, any>} */ ({});
              visited[id] = clone;

              for (var key in o) {
                if (o.hasOwnProperty(key)) {
                  clone[key] = deepClone(o[key], visited);
                }
              }

              return /** @type {any} */ (clone);

            case 'Array':
              id = _.util.objId(o);
              if (visited[id]) {
                return visited[id];
              }
              clone = [];
              visited[id] = clone;

              /** @type {Array} */
              /** @type {any} */ (o).forEach(function (v, i) {
                clone[i] = deepClone(v, visited);
              });

              return /** @type {any} */ (clone);

            default:
              return o;
          }
        },

        /**
         * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
         *
         * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
         *
         * @param {Element} element
         * @returns {string}
         */
        getLanguage: function (element) {
          while (element) {
            var m = lang.exec(element.className);
            if (m) {
              return m[1].toLowerCase();
            }
            element = element.parentElement;
          }
          return 'none';
        },

        /**
         * Sets the Prism `language-xxxx` class of the given element.
         *
         * @param {Element} element
         * @param {string} language
         * @returns {void}
         */
        setLanguage: function (element, language) {
          // remove all `language-xxxx` classes
          // (this might leave behind a leading space)
          element.className = element.className.replace(RegExp(lang, 'gi'), '');

          // add the new `language-xxxx` class
          // (using `classList` will automatically clean up spaces for us)
          element.classList.add('language-' + language);
        },

        /**
         * Returns the script element that is currently executing.
         *
         * This does __not__ work for line script element.
         *
         * @returns {HTMLScriptElement | null}
         */
        currentScript: function () {
          if (typeof document === 'undefined') {
            return null;
          }
          if (
              'currentScript' in document &&
              1 < 2 /* hack to trip TS' flow analysis */
          ) {
            return /** @type {any} */ (document.currentScript);
          }

          // IE11 workaround
          // we'll get the src of the current script by parsing IE11's error stack trace
          // this will not work for inline scripts

          try {
            throw new Error();
          } catch (err) {
            // Get file src url from stack. Specifically works with the format of stack traces in IE.
            // A stack will look like this:
            //
            // Error
            //    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
            //    at Global code (http://localhost/components/prism-core.js:606:1)

            var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) ||
                [])[1];
            if (src) {
              var scripts = document.getElementsByTagName('script');
              for (var i in scripts) {
                if (scripts[i].src == src) {
                  return scripts[i];
                }
              }
            }
            return null;
          }
        },

        /**
         * Returns whether a given class is active for `element`.
         *
         * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
         * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
         * given class is just the given class with a `no-` prefix.
         *
         * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
         * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
         * ancestors have the given class or the negated version of it, then the default activation will be returned.
         *
         * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
         * version of it, the class is considered active.
         *
         * @param {Element} element
         * @param {string} className
         * @param {boolean} [defaultActivation=false]
         * @returns {boolean}
         */
        isActive: function (element, className, defaultActivation) {
          var no = 'no-' + className;

          while (element) {
            var classList = element.classList;
            if (classList.contains(className)) {
              return true;
            }
            if (classList.contains(no)) {
              return false;
            }
            element = element.parentElement;
          }
          return !!defaultActivation;
        },
      },

      /**
       * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
       *
       * @namespace
       * @memberof Prism
       * @public
       */
      languages: {
        /**
         * The grammar for plain, unformatted text.
         */
        plain: plainTextGrammar,
        plaintext: plainTextGrammar,
        text: plainTextGrammar,
        txt: plainTextGrammar,

        /**
         * Creates a deep copy of the language with the given id and appends the given tokens.
         *
         * If a token in `redef` also appears in the copied language, then the existing token in the copied language
         * will be overwritten at its original position.
         *
         * ## Best practices
         *
         * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
         * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
         * understand the language definition because, normally, the order of tokens matters in Prism grammars.
         *
         * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
         * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
         *
         * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
         * @param {Grammar} redef The new tokens to append.
         * @returns {Grammar} The new language created.
         * @public
         * @example
         * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
         *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
         *     // at its original position
         *     'comment': { ... },
         *     // CSS doesn't have a 'color' token, so this token will be appended
         *     'color': /\b(?:red|green|blue)\b/
         * });
         */
        extend: function (id, redef) {
          var lang = _.util.clone(_.languages[id]);

          for (var key in redef) {
            lang[key] = redef[key];
          }

          return lang;
        },

        /**
         * Inserts tokens _before_ another token in a language definition or any other grammar.
         *
         * ## Usage
         *
         * This helper method makes it easy to modify existing languages. For example, the CSS language definition
         * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
         * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
         * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
         * this:
         *
         * ```js
         * Prism.languages.markup.style = {
         *     // token
         * };
         * ```
         *
         * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
         * before existing tokens. For the CSS example above, you would use it like this:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'cdata', {
         *     'style': {
         *         // token
         *     }
         * });
         * ```
         *
         * ## Special cases
         *
         * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
         * will be ignored.
         *
         * This behavior can be used to insert tokens after `before`:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'comment', {
         *     'comment': Prism.languages.markup.comment,
         *     // tokens after 'comment'
         * });
         * ```
         *
         * ## Limitations
         *
         * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
         * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
         * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
         * deleting properties which is necessary to insert at arbitrary positions.
         *
         * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
         * Instead, it will create a new object and replace all references to the target object with the new one. This
         * can be done without temporarily deleting properties, so the iteration order is well-defined.
         *
         * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
         * you hold the target object in a variable, then the value of the variable will not change.
         *
         * ```js
         * var oldMarkup = Prism.languages.markup;
         * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
         *
         * assert(oldMarkup !== Prism.languages.markup);
         * assert(newMarkup === Prism.languages.markup);
         * ```
         *
         * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
         * object to be modified.
         * @param {string} before The key to insert before.
         * @param {Grammar} insert An object containing the key-value pairs to be inserted.
         * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
         * object to be modified.
         *
         * Defaults to `Prism.languages`.
         * @returns {Grammar} The new grammar object.
         * @public
         */
        insertBefore: function (inside, before, insert, root) {
          root = root || /** @type {any} */ (_.languages);
          var grammar = root[inside];
          /** @type {Grammar} */
          var ret = {};

          for (var token in grammar) {
            if (grammar.hasOwnProperty(token)) {
              if (token == before) {
                for (var newToken in insert) {
                  if (insert.hasOwnProperty(newToken)) {
                    ret[newToken] = insert[newToken];
                  }
                }
              }

              // Do not insert token which also occur in insert. See #1525
              if (!insert.hasOwnProperty(token)) {
                ret[token] = grammar[token];
              }
            }
          }

          var old = root[inside];
          root[inside] = ret;

          // Update references in other language definitions
          _.languages.DFS(_.languages, function (key, value) {
            if (value === old && key != inside) {
              this[key] = ret;
            }
          });

          return ret;
        },

        // Traverse a language definition with Depth First Search
        DFS: function DFS(o, callback, type, visited) {
          visited = visited || {};

          var objId = _.util.objId;

          for (var i in o) {
            if (o.hasOwnProperty(i)) {
              callback.call(o, i, o[i], type || i);

              var property = o[i];
              var propertyType = _.util.type(property);

              if (propertyType === 'Object' && !visited[objId(property)]) {
                visited[objId(property)] = true;
                DFS(property, callback, null, visited);
              } else if (
                  propertyType === 'Array' &&
                  !visited[objId(property)]
              ) {
                visited[objId(property)] = true;
                DFS(property, callback, i, visited);
              }
            }
          }
        },
      },

      plugins: {},

      /**
       * This is the most high-level function in Prism’s API.
       * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
       * each one of them.
       *
       * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
       *
       * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
       * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
       * @memberof Prism
       * @public
       */
      highlightAll: function (async, callback) {
        _.highlightAllUnder(document, async, callback);
      },

      /**
       * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
       * {@link Prism.highlightElement} on each one of them.
       *
       * The following hooks will be run:
       * 1. `before-highlightall`
       * 2. `before-all-elements-highlight`
       * 3. All hooks of {@link Prism.highlightElement} for each element.
       *
       * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
       * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
       * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
       * @memberof Prism
       * @public
       */
      highlightAllUnder: function (container, async, callback) {
        var env = {
          callback: callback,
          container: container,
          selector:
              'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
        };

        _.hooks.run('before-highlightall', env);

        env.elements = Array.prototype.slice.apply(
            env.container.querySelectorAll(env.selector)
        );

        _.hooks.run('before-all-elements-highlight', env);

        for (var i = 0, element; (element = env.elements[i++]);) {
          _.highlightElement(element, async === true, env.callback);
        }
      },

      /**
       * Highlights the code inside a single element.
       *
       * The following hooks will be run:
       * 1. `before-sanity-check`
       * 2. `before-highlight`
       * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
       * 4. `before-insert`
       * 5. `after-highlight`
       * 6. `complete`
       *
       * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
       * the element's language.
       *
       * @param {Element} element The element containing the code.
       * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
       * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
       * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
       * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
       *
       * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
       * asynchronous highlighting to work. You can build your own bundle on the
       * [Download page](https://prismjs.com/download.html).
       * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
       * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
       * @memberof Prism
       * @public
       */
      highlightElement: function (element, async, callback) {
        // Find language
        var language = _.util.getLanguage(element);
        var grammar = _.languages[language];

        // Set language on the element, if not present
        _.util.setLanguage(element, language);

        // Set language on the parent, for styling
        var parent = element.parentElement;
        if (parent && parent.nodeName.toLowerCase() === 'pre') {
          _.util.setLanguage(parent, language);
        }

        var code = element.textContent;

        var env = {
          element: element,
          language: language,
          grammar: grammar,
          code: code,
        };

        function insertHighlightedCode(highlightedCode) {
          env.highlightedCode = highlightedCode;

          _.hooks.run('before-insert', env);

          env.element.innerHTML = env.highlightedCode;

          _.hooks.run('after-highlight', env);
          _.hooks.run('complete', env);
          callback && callback.call(env.element);
        }

        _.hooks.run('before-sanity-check', env);

        // plugins may change/add the parent/element
        parent = env.element.parentElement;
        if (
            parent &&
            parent.nodeName.toLowerCase() === 'pre' &&
            !parent.hasAttribute('tabindex')
        ) {
          parent.setAttribute('tabindex', '0');
        }

        if (!env.code) {
          _.hooks.run('complete', env);
          callback && callback.call(env.element);
          return;
        }

        _.hooks.run('before-highlight', env);

        if (!env.grammar) {
          insertHighlightedCode(_.util.encode(env.code));
          return;
        }

        if (async && _self.Worker) {
          var worker = new Worker(_.filename);

          worker.onmessage = function (evt) {
            insertHighlightedCode(evt.data);
          };

          worker.postMessage(
              JSON.stringify({
                language: env.language,
                code: env.code,
                immediateClose: true,
              })
          );
        } else {
          insertHighlightedCode(
              _.highlight(env.code, env.grammar, env.language)
          );
        }
      },

      /**
       * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
       * and the language definitions to use, and returns a string with the HTML produced.
       *
       * The following hooks will be run:
       * 1. `before-tokenize`
       * 2. `after-tokenize`
       * 3. `wrap`: On each {@link Token}.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @param {string} language The name of the language definition passed to `grammar`.
       * @returns {string} The highlighted HTML.
       * @memberof Prism
       * @public
       * @example
       * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
       */
      highlight: function (text, grammar, language) {
        var env = {
          code: text,
          grammar: grammar,
          language: language,
        };
        _.hooks.run('before-tokenize', env);
        if (!env.grammar) {
          throw new Error(
              'The language "' + env.language + '" has no grammar.'
          );
        }
        env.tokens = _.tokenize(env.code, env.grammar);
        _.hooks.run('after-tokenize', env);
        return Token.stringify(_.util.encode(env.tokens), env.language);
      },

      /**
       * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
       * and the language definitions to use, and returns an array with the tokenized code.
       *
       * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
       *
       * This method could be useful in other contexts as well, as a very crude parser.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @returns {TokenStream} An array of strings and tokens, a token stream.
       * @memberof Prism
       * @public
       * @example
       * let code = `var foo = 0;`;
       * let tokens = Prism.tokenize(code, Prism.languages.javascript);
       * tokens.forEach(token => {
       *     if (token instanceof Prism.Token && token.type === 'number') {
       *         console.log(`Found numeric literal: ${token.content}`);
       *     }
       * });
       */
      tokenize: function (text, grammar) {
        var rest = grammar.rest;
        if (rest) {
          for (var token in rest) {
            grammar[token] = rest[token];
          }

          delete grammar.rest;
        }

        var tokenList = new LinkedList();
        addAfter(tokenList, tokenList.head, text);

        matchGrammar(text, tokenList, grammar, tokenList.head, 0);

        return toArray(tokenList);
      },

      /**
       * @namespace
       * @memberof Prism
       * @public
       */
      hooks: {
        all: {},

        /**
         * Adds the given callback to the list of callbacks for the given hook.
         *
         * The callback will be invoked when the hook it is registered for is run.
         * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
         *
         * One callback function can be registered to multiple hooks and the same hook multiple times.
         *
         * @param {string} name The name of the hook.
         * @param {HookCallback} callback The callback function which is given environment variables.
         * @public
         */
        add: function (name, callback) {
          var hooks = _.hooks.all;

          hooks[name] = hooks[name] || [];

          hooks[name].push(callback);
        },

        /**
         * Runs a hook invoking all registered callbacks with the given environment variables.
         *
         * Callbacks will be invoked synchronously and in the order in which they were registered.
         *
         * @param {string} name The name of the hook.
         * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
         * @public
         */
        run: function (name, env) {
          var callbacks = _.hooks.all[name];

          if (!callbacks || !callbacks.length) {
            return;
          }

          for (var i = 0, callback; (callback = callbacks[i++]);) {
            callback(env);
          }
        },
      },

      Token: Token,
    };
    _self.Prism = _;

    // Typescript note:
    // The following can be used to import the Token type in JSDoc:
    //
    //   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

    /**
     * Creates a new token.
     *
     * @param {string} type See {@link Token#type type}
     * @param {string | TokenStream} content See {@link Token#content content}
     * @param {string|string[]} [alias] The alias(es) of the token.
     * @param {string} [matchedStr=""] A copy of the full string this token was created from.
     * @class
     * @global
     * @public
     */
    function Token(type, content, alias, matchedStr) {
      /**
       * The type of the token.
       *
       * This is usually the key of a pattern in a {@link Grammar}.
       *
       * @type {string}
       * @see GrammarToken
       * @public
       */
      this.type = type;
      /**
       * The strings or tokens contained by this token.
       *
       * This will be a token stream if the pattern matched also defined an `inside` grammar.
       *
       * @type {string | TokenStream}
       * @public
       */
      this.content = content;
      /**
       * The alias(es) of the token.
       *
       * @type {string|string[]}
       * @see GrammarToken
       * @public
       */
      this.alias = alias;
      // Copy of the full string this token was created from
      this.length = (matchedStr || '').length | 0;
    }

    /**
     * A token stream is an array of strings and {@link Token Token} objects.
     *
     * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
     * them.
     *
     * 1. No adjacent strings.
     * 2. No empty strings.
     *
     *    The only exception here is the token stream that only contains the empty string and nothing else.
     *
     * @typedef {Array<string | Token>} TokenStream
     * @global
     * @public
     */

    /**
     * Converts the given token or token stream to an HTML representation.
     *
     * The following hooks will be run:
     * 1. `wrap`: On each {@link Token}.
     *
     * @param {string | Token | TokenStream} o The token or token stream to be converted.
     * @param {string} language The name of current language.
     * @returns {string} The HTML representation of the token or token stream.
     * @memberof Token
     * @static
     */
    Token.stringify = function stringify(o, language) {
      if (typeof o == 'string') {
        return o;
      }
      if (Array.isArray(o)) {
        var s = '';
        o.forEach(function (e) {
          s += stringify(e, language);
        });
        return s;
      }

      var env = {
        type: o.type,
        content: stringify(o.content, language),
        tag: 'span',
        classes: ['token', o.type],
        attributes: {},
        language: language,
      };

      var aliases = o.alias;
      if (aliases) {
        if (Array.isArray(aliases)) {
          Array.prototype.push.apply(env.classes, aliases);
        } else {
          env.classes.push(aliases);
        }
      }

      _.hooks.run('wrap', env);

      var attributes = '';
      for (var name in env.attributes) {
        attributes +=
            ' ' +
            name +
            '="' +
            (env.attributes[name] || '').replace(/"/g, '&quot;') +
            '"';
      }

      return (
          '<' +
          env.tag +
          ' class="' +
          env.classes.join(' ') +
          '"' +
          attributes +
          '>' +
          env.content +
          '</' +
          env.tag +
          '>'
      );
    };

    /**
     * @param {RegExp} pattern
     * @param {number} pos
     * @param {string} text
     * @param {boolean} lookbehind
     * @returns {RegExpExecArray | null}
     */
    function matchPattern(pattern, pos, text, lookbehind) {
      pattern.lastIndex = pos;
      var match = pattern.exec(text);
      if (match && lookbehind && match[1]) {
        // change the match to remove the text matched by the Prism lookbehind group
        var lookbehindLength = match[1].length;
        match.index += lookbehindLength;
        match[0] = match[0].slice(lookbehindLength);
      }
      return match;
    }

    /**
     * @param {string} text
     * @param {LinkedList<string | Token>} tokenList
     * @param {any} grammar
     * @param {LinkedListNode<string | Token>} startNode
     * @param {number} startPos
     * @param {RematchOptions} [rematch]
     * @returns {void}
     * @private
     *
     * @typedef RematchOptions
     * @property {string} cause
     * @property {number} reach
     */
    function matchGrammar(
        text,
        tokenList,
        grammar,
        startNode,
        startPos,
        rematch
    ) {
      for (var token in grammar) {
        if (!grammar.hasOwnProperty(token) || !grammar[token]) {
          continue;
        }

        var patterns = grammar[token];
        patterns = Array.isArray(patterns) ? patterns : [patterns];

        for (var j = 0; j < patterns.length; ++j) {
          if (rematch && rematch.cause == token + ',' + j) {
            return;
          }

          var patternObj = patterns[j];
          var inside = patternObj.inside;
          var lookbehind = !!patternObj.lookbehind;
          var greedy = !!patternObj.greedy;
          var alias = patternObj.alias;

          if (greedy && !patternObj.pattern.global) {
            // Without the global flag, lastIndex won't work
            var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
            patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
          }

          /** @type {RegExp} */
          var pattern = patternObj.pattern || patternObj;

          for (
              // iterate the token list and keep track of the current token/string position
              var currentNode = startNode.next, pos = startPos;
              currentNode !== tokenList.tail;
              pos += currentNode.value.length, currentNode = currentNode.next
          ) {
            if (rematch && pos >= rematch.reach) {
              break;
            }

            var str = currentNode.value;

            if (tokenList.length > text.length) {
              // Something went terribly wrong, ABORT, ABORT!
              return;
            }

            if (str instanceof Token) {
              continue;
            }

            var removeCount = 1; // this is the to parameter of removeBetween
            var match;

            if (greedy) {
              match = matchPattern(pattern, pos, text, lookbehind);
              if (!match || match.index >= text.length) {
                break;
              }

              var from = match.index;
              var to = match.index + match[0].length;
              var p = pos;

              // find the node that contains the match
              p += currentNode.value.length;
              while (from >= p) {
                currentNode = currentNode.next;
                p += currentNode.value.length;
              }
              // adjust pos (and p)
              p -= currentNode.value.length;
              pos = p;

              // the current node is a Token, then the match starts inside another Token, which is invalid
              if (currentNode.value instanceof Token) {
                continue;
              }

              // find the last node which is affected by this match
              for (
                  var k = currentNode;
                  k !== tokenList.tail && (p < to || typeof k.value === 'string');
                  k = k.next
              ) {
                removeCount++;
                p += k.value.length;
              }
              removeCount--;

              // replace with the new match
              str = text.slice(pos, p);
              match.index -= pos;
            } else {
              match = matchPattern(pattern, 0, str, lookbehind);
              if (!match) {
                continue;
              }
            }

            // eslint-disable-next-line no-redeclare
            var from = match.index;
            var matchStr = match[0];
            var before = str.slice(0, from);
            var after = str.slice(from + matchStr.length);

            var reach = pos + str.length;
            if (rematch && reach > rematch.reach) {
              rematch.reach = reach;
            }

            var removeFrom = currentNode.prev;

            if (before) {
              removeFrom = addAfter(tokenList, removeFrom, before);
              pos += before.length;
            }

            removeRange(tokenList, removeFrom, removeCount);

            var wrapped = new Token(
                token,
                inside ? _.tokenize(matchStr, inside) : matchStr,
                alias,
                matchStr
            );
            currentNode = addAfter(tokenList, removeFrom, wrapped);

            if (after) {
              addAfter(tokenList, currentNode, after);
            }

            if (removeCount > 1) {
              // at least one Token object was removed, so we have to do some rematching
              // this can only happen if the current pattern is greedy

              /** @type {RematchOptions} */
              var nestedRematch = {
                cause: token + ',' + j,
                reach: reach,
              };
              matchGrammar(
                  text,
                  tokenList,
                  grammar,
                  currentNode.prev,
                  pos,
                  nestedRematch
              );

              // the reach might have been extended because of the rematching
              if (rematch && nestedRematch.reach > rematch.reach) {
                rematch.reach = nestedRematch.reach;
              }
            }
          }
        }
      }
    }

    /**
     * @typedef LinkedListNode
     * @property {T} value
     * @property {LinkedListNode<T> | null} prev The previous node.
     * @property {LinkedListNode<T> | null} next The next node.
     * @template T
     * @private
     */

    /**
     * @template T
     * @private
     */
    function LinkedList() {
      /** @type {LinkedListNode<T>} */
      var head = {value: null, prev: null, next: null};
      /** @type {LinkedListNode<T>} */
      var tail = {value: null, prev: head, next: null};
      head.next = tail;

      /** @type {LinkedListNode<T>} */
      this.head = head;
      /** @type {LinkedListNode<T>} */
      this.tail = tail;
      this.length = 0;
    }

    /**
     * Adds a new node with the given value to the list.
     *
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {T} value
     * @returns {LinkedListNode<T>} The added node.
     * @template T
     */
    function addAfter(list, node, value) {
      // assumes that node != list.tail && values.length >= 0
      var next = node.next;

      var newNode = {value: value, prev: node, next: next};
      node.next = newNode;
      next.prev = newNode;
      list.length++;

      return newNode;
    }

    /**
     * Removes `count` nodes after the given node. The given node will not be removed.
     *
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {number} count
     * @template T
     */
    function removeRange(list, node, count) {
      var next = node.next;
      for (var i = 0; i < count && next !== list.tail; i++) {
        next = next.next;
      }
      node.next = next;
      next.prev = node;
      list.length -= i;
    }

    /**
     * @param {LinkedList<T>} list
     * @returns {T[]}
     * @template T
     */
    function toArray(list) {
      var array = [];
      var node = list.head.next;
      while (node !== list.tail) {
        array.push(node.value);
        node = node.next;
      }
      return array;
    }

    if (!_self.document) {
      if (!_self.addEventListener) {
        // in Node.js
        return _;
      }

      if (!_.disableWorkerMessageHandler) {
        // In worker
        _self.addEventListener(
            'message',
            function (evt) {
              var message = JSON.parse(evt.data);
              var lang = message.language;
              var code = message.code;
              var immediateClose = message.immediateClose;

              _self.postMessage(_.highlight(code, _.languages[lang], lang));
              if (immediateClose) {
                _self.close();
              }
            },
            false
        );
      }

      return _;
    }

    // Get current script and highlight
    var script = _.util.currentScript();

    if (script) {
      _.filename = script.src;

      if (script.hasAttribute('data-manual')) {
        _.manual = true;
      }
    }

    function highlightAutomaticallyCallback() {
      if (!_.manual) {
        _.highlightAll();
      }
    }

    if (!_.manual) {
      // If the document state is "loading", then we'll use DOMContentLoaded.
      // If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
      // DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
      // might take longer one animation frame to execute which can create a race condition where only some plugins have
      // been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
      // See https://github.com/PrismJS/prism/issues/2102
      var readyState = document.readyState;
      if (
          readyState === 'loading' ||
          (readyState === 'interactive' && script && script.defer)
      ) {
        document.addEventListener(
            'DOMContentLoaded',
            highlightAutomaticallyCallback
        );
      } else {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(highlightAutomaticallyCallback);
        } else {
          window.setTimeout(highlightAutomaticallyCallback, 16);
        }
      }
    }

    return _;
  })(_self);

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Prism;
  }

  // hack for components to work correctly in node.js
  if (typeof global !== 'undefined') {
    global.Prism = Prism;
  }

  // some additional documentation/types

  /**
   * The expansion of a simple `RegExp` literal to support additional properties.
   *
   * @typedef GrammarToken
   * @property {RegExp} pattern The regular expression of the token.
   * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
   * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
   * @property {boolean} [greedy=false] Whether the token is greedy.
   * @property {string|string[]} [alias] An optional alias or list of aliases.
   * @property {Grammar} [inside] The nested grammar of this token.
   *
   * The `inside` grammar will be used to tokenize the text value of each token of this kind.
   *
   * This can be used to make nested and even recursive language definitions.
   *
   * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
   * each another.
   * @global
   * @public
   */

  /**
   * @typedef Grammar
   * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
   * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
   * @global
   * @public
   */

  /**
   * A function which will invoked after an element was successfully highlighted.
   *
   * @callback HighlightCallback
   * @param {Element} element The element successfully highlighted.
   * @returns {void}
   * @global
   * @public
   */

  /**
   * @callback HookCallback
   * @param {Object<string, any>} env The environment variables of the hook.
   * @returns {void}
   * @global
   * @public
   */
  Prism.languages.markup = {
    comment: {
      pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
      greedy: true,
    },
    prolog: {
      pattern: /<\?[\s\S]+?\?>/,
      greedy: true,
    },
    doctype: {
      // https://www.w3.org/TR/xml/#NT-doctypedecl
      pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
      greedy: true,
      inside: {
        'internal-subset': {
          pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
          lookbehind: true,
          greedy: true,
          inside: null, // see below
        },
        string: {
          pattern: /"[^"]*"|'[^']*'/,
          greedy: true,
        },
        punctuation: /^<!|>$|[[\]]/,
        'doctype-tag': /^DOCTYPE/i,
        name: /[^\s<>'"]+/,
      },
    },
    cdata: {
      pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
      greedy: true,
    },
    tag: {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: true,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/,
          inside: {
            punctuation: /^<\/?/,
            namespace: /^[^\s>\/:]+:/,
          },
        },
        'special-attr': [],
        'attr-value': {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            punctuation: [
              {
                pattern: /^=/,
                alias: 'attr-equals',
              },
              /"|'/,
            ],
          },
        },
        punctuation: /\/?>/,
        'attr-name': {
          pattern: /[^\s>\/]+/,
          inside: {
            namespace: /^[^\s>\/:]+:/,
          },
        },
      },
    },
    entity: [
      {
        pattern: /&[\da-z]{1,8};/i,
        alias: 'named-entity',
      },
      /&#x?[\da-f]{1,8};/i,
    ],
  };

  Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
      Prism.languages.markup['entity'];
  Prism.languages.markup['doctype'].inside['internal-subset'].inside =
      Prism.languages.markup;

  // Plugin to make entity title show the real entity, idea by Roman Komarov
  Prism.hooks.add('wrap', function (env) {
    if (env.type === 'entity') {
      env.attributes['title'] = env.content.replace(/&amp;/, '&');
    }
  });

  Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    /**
     * Adds an inlined language to markup.
     *
     * An example of an inlined language is CSS with `<style>` tags.
     *
     * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addInlined('style', 'css');
     */
    value: function addInlined(tagName, lang) {
      var includedCdataInside = {};
      includedCdataInside['language-' + lang] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: true,
        inside: Prism.languages[lang],
      };
      includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

      var inside = {
        'included-cdata': {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: includedCdataInside,
        },
      };
      inside['language-' + lang] = {
        pattern: /[\s\S]+/,
        inside: Prism.languages[lang],
      };

      var def = {};
      def[tagName] = {
        pattern: RegExp(
            /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
                /__/g,
                function () {
                  return tagName;
                }
            ),
            'i'
        ),
        lookbehind: true,
        greedy: true,
        inside: inside,
      };

      Prism.languages.insertBefore('markup', 'cdata', def);
    },
  });
  Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
    /**
     * Adds an pattern to highlight languages embedded in HTML attributes.
     *
     * An example of an inlined language is CSS with `style` attributes.
     *
     * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addAttribute('style', 'css');
     */
    value: function (attrName, lang) {
      Prism.languages.markup.tag.inside['special-attr'].push({
        pattern: RegExp(
            /(^|["'\s])/.source +
            '(?:' +
            attrName +
            ')' +
            /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
            'i'
        ),
        lookbehind: true,
        inside: {
          'attr-name': /^[^\s=]+/,
          'attr-value': {
            pattern: /=[\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: true,
                alias: [lang, 'language-' + lang],
                inside: Prism.languages[lang],
              },
              punctuation: [
                {
                  pattern: /^=/,
                  alias: 'attr-equals',
                },
                /"|'/,
              ],
            },
          },
        },
      });
    },
  });

  Prism.languages.html = Prism.languages.markup;
  Prism.languages.mathml = Prism.languages.markup;
  Prism.languages.svg = Prism.languages.markup;

  Prism.languages.xml = Prism.languages.extend('markup', {});
  Prism.languages.ssml = Prism.languages.xml;
  Prism.languages.atom = Prism.languages.xml;
  Prism.languages.rss = Prism.languages.xml;

  (function (Prism) {
    var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;

    Prism.languages.css = {
      comment: /\/\*[\s\S]*?\*\//,
      atrule: {
        pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
        inside: {
          rule: /^@[\w-]+/,
          'selector-function-argument': {
            pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
            lookbehind: true,
            alias: 'selector',
          },
          keyword: {
            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
            lookbehind: true,
          },
          // See rest below
        },
      },
      url: {
        // https://drafts.csswg.org/css-values-3/#urls
        pattern: RegExp(
            '\\burl\\((?:' +
            string.source +
            '|' +
            /(?:[^\\\r\n()"']|\\[\s\S])*/.source +
            ')\\)',
            'i'
        ),
        greedy: true,
        inside: {
          function: /^url/i,
          punctuation: /^\(|\)$/,
          string: {
            pattern: RegExp('^' + string.source + '$'),
            alias: 'url',
          },
        },
      },
      selector: {
        pattern: RegExp(
            '(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' +
            string.source +
            ')*(?=\\s*\\{)'
        ),
        lookbehind: true,
      },
      string: {
        pattern: string,
        greedy: true,
      },
      property: {
        pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
        lookbehind: true,
      },
      important: /!important\b/i,
      function: {
        pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
        lookbehind: true,
      },
      punctuation: /[(){};:,]/,
    };

    Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

    var markup = Prism.languages.markup;
    if (markup) {
      markup.tag.addInlined('style', 'css');
      markup.tag.addAttribute('style', 'css');
    }
  })(Prism);

  Prism.languages.clike = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true,
        greedy: true,
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true,
      },
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true,
    },
    'class-name': {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: true,
      inside: {
        punctuation: /[.\\]/,
      },
    },
    keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    boolean: /\b(?:false|true)\b/,
    function: /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/,
  };

  Prism.languages.javascript = Prism.languages.extend('clike', {
    'class-name': [
      Prism.languages.clike['class-name'],
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
        lookbehind: true,
      },
    ],
    keyword: [
      {
        pattern: /((?:^|\})\s*)catch\b/,
        lookbehind: true,
      },
      {
        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: true,
      },
    ],
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    number: {
      pattern: RegExp(
          /(^|[^\w$])/.source +
          '(?:' +
          // constant
          (/NaN|Infinity/.source +
              '|' +
              // binary integer
              /0[bB][01]+(?:_[01]+)*n?/.source +
              '|' +
              // octal integer
              /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
              '|' +
              // hexadecimal integer
              /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
              '|' +
              // decimal bigint
              /\d+(?:_\d+)*n/.source +
              '|' +
              // decimal number (integer or float) but no bigint
              /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
                  .source) +
          ')' +
          /(?![\w$])/.source
      ),
      lookbehind: true,
    },
    operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
  });

  Prism.languages.javascript[
      'class-name'
      ][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;

  Prism.languages.insertBefore('javascript', 'keyword', {
    regex: {
      pattern: RegExp(
          // lookbehind
          // eslint-disable-next-line regexp/no-dupe-characters-character-class
          /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
          // Regex pattern:
          // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
          // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
          // with the only syntax, so we have to define 2 different regex patterns.
          /\//.source +
          '(?:' +
          /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/
              .source +
          '|' +
          // `v` flag syntax. This supports 3 levels of nested character classes.
          /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/
              .source +
          ')' +
          // lookahead
          /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/
              .source
      ),
      lookbehind: true,
      greedy: true,
      inside: {
        'regex-source': {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: true,
          alias: 'language-regex',
          inside: Prism.languages.regex,
        },
        'regex-delimiter': /^\/|\/$/,
        'regex-flags': /^[a-z]+$/,
      },
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    'function-variable': {
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: 'function',
    },
    parameter: [
      {
        pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: true,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: true,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: true,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: true,
        inside: Prism.languages.javascript,
      },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
  });

  Prism.languages.insertBefore('javascript', 'string', {
    hashbang: {
      pattern: /^#!.*/,
      greedy: true,
      alias: 'comment',
    },
    'template-string': {
      pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: true,
      inside: {
        'template-punctuation': {
          pattern: /^`|`$/,
          alias: 'string',
        },
        interpolation: {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: true,
          inside: {
            'interpolation-punctuation': {
              pattern: /^\$\{|\}$/,
              alias: 'punctuation',
            },
            rest: Prism.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
    'string-property': {
      pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: true,
      greedy: true,
      alias: 'property',
    },
  });

  Prism.languages.insertBefore('javascript', 'operator', {
    'literal-property': {
      pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: true,
      alias: 'property',
    },
  });

  if (Prism.languages.markup) {
    Prism.languages.markup.tag.addInlined('script', 'javascript');

    // add attribute support for all DOM events.
    // https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events
    Prism.languages.markup.tag.addAttribute(
        /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
            .source,
        'javascript'
    );
  }

  Prism.languages.js = Prism.languages.javascript;

  Prism.languages.apacheconf = {
    comment: /#.*/,
    'directive-inline': {
      pattern: /(^[\t ]*)\b(?:AcceptFilter|AcceptPathInfo|AccessFileName|Action|Add(?:Alt|AltByEncoding|AltByType|Charset|DefaultCharset|Description|Encoding|Handler|Icon|IconByEncoding|IconByType|InputFilter|Language|ModuleInfo|OutputFilter|OutputFilterByType|Type)|Alias|AliasMatch|Allow(?:CONNECT|EncodedSlashes|Methods|Override|OverrideList)?|Anonymous(?:_LogEmail|_MustGiveEmail|_NoUserID|_VerifyEmail)?|AsyncRequestWorkerFactor|Auth(?:BasicAuthoritative|BasicFake|BasicProvider|BasicUseDigestAlgorithm|DBDUserPWQuery|DBDUserRealmQuery|DBMGroupFile|DBMType|DBMUserFile|Digest(?:Algorithm|Domain|NonceLifetime|Provider|Qop|ShmemSize)|Form(?:Authoritative|Body|DisableNoStore|FakeBasicAuth|Location|LoginRequiredLocation|LoginSuccessLocation|LogoutLocation|Method|Mimetype|Password|Provider|SitePassphrase|Size|Username)|GroupFile|LDAP(?:AuthorizePrefix|BindAuthoritative|BindDN|BindPassword|CharsetConfig|CompareAsUser|CompareDNOnServer|DereferenceAliases|GroupAttribute|GroupAttributeIsDN|InitialBindAsUser|InitialBindPattern|MaxSubGroupDepth|RemoteUserAttribute|RemoteUserIsDN|SearchAsUser|SubGroupAttribute|SubGroupClass|Url)|Merging|Name|nCache(?:Context|Enable|ProvideFor|SOCache|Timeout)|nzFcgiCheckAuthnProvider|nzFcgiDefineProvider|Type|UserFile|zDBDLoginToReferer|zDBDQuery|zDBDRedirectQuery|zDBMType|zSendForbiddenOnFailure)|BalancerGrowth|BalancerInherit|BalancerMember|BalancerPersist|BrowserMatch|BrowserMatchNoCase|BufferedLogs|BufferSize|Cache(?:DefaultExpire|DetailHeader|DirLength|DirLevels|Disable|Enable|File|Header|IgnoreCacheControl|IgnoreHeaders|IgnoreNoLastMod|IgnoreQueryString|IgnoreURLSessionIdentifiers|KeyBaseURL|LastModifiedFactor|Lock|LockMaxAge|LockPath|MaxExpire|MaxFileSize|MinExpire|MinFileSize|NegotiatedDocs|QuickHandler|ReadSize|ReadTime|Root|Socache(?:MaxSize|MaxTime|MinTime|ReadSize|ReadTime)?|StaleOnError|StoreExpired|StoreNoStore|StorePrivate)|CGIDScriptTimeout|CGIMapExtension|CharsetDefault|CharsetOptions|CharsetSourceEnc|CheckCaseOnly|CheckSpelling|ChrootDir|ContentDigest|CookieDomain|CookieExpires|CookieName|CookieStyle|CookieTracking|CoreDumpDirectory|CustomLog|Dav|DavDepthInfinity|DavGenericLockDB|DavLockDB|DavMinTimeout|DBDExptime|DBDInitSQL|DBDKeep|DBDMax|DBDMin|DBDParams|DBDPersist|DBDPrepareSQL|DBDriver|DefaultIcon|DefaultLanguage|DefaultRuntimeDir|DefaultType|Define|Deflate(?:BufferSize|CompressionLevel|FilterNote|InflateLimitRequestBody|InflateRatio(?:Burst|Limit)|MemLevel|WindowSize)|Deny|DirectoryCheckHandler|DirectoryIndex|DirectoryIndexRedirect|DirectorySlash|DocumentRoot|DTracePrivileges|DumpIOInput|DumpIOOutput|EnableExceptionHook|EnableMMAP|EnableSendfile|Error|ErrorDocument|ErrorLog|ErrorLogFormat|Example|ExpiresActive|ExpiresByType|ExpiresDefault|ExtendedStatus|ExtFilterDefine|ExtFilterOptions|FallbackResource|FileETag|FilterChain|FilterDeclare|FilterProtocol|FilterProvider|FilterTrace|ForceLanguagePriority|ForceType|ForensicLog|GprofDir|GracefulShutdownTimeout|Group|Header|HeaderName|Heartbeat(?:Address|Listen|MaxServers|Storage)|HostnameLookups|IdentityCheck|IdentityCheckTimeout|ImapBase|ImapDefault|ImapMenu|Include|IncludeOptional|Index(?:HeadInsert|Ignore|IgnoreReset|Options|OrderDefault|StyleSheet)|InputSed|ISAPI(?:AppendLogToErrors|AppendLogToQuery|CacheFile|FakeAsync|LogNotSupported|ReadAheadBuffer)|KeepAlive|KeepAliveTimeout|KeptBodySize|LanguagePriority|LDAP(?:CacheEntries|CacheTTL|ConnectionPoolTTL|ConnectionTimeout|LibraryDebug|OpCacheEntries|OpCacheTTL|ReferralHopLimit|Referrals|Retries|RetryDelay|SharedCacheFile|SharedCacheSize|Timeout|TrustedClientCert|TrustedGlobalCert|TrustedMode|VerifyServerCert)|Limit(?:InternalRecursion|Request(?:Body|Fields|FieldSize|Line)|XMLRequestBody)|Listen|ListenBackLog|LoadFile|LoadModule|LogFormat|LogLevel|LogMessage|LuaAuthzProvider|LuaCodeCache|Lua(?:Hook(?:AccessChecker|AuthChecker|CheckUserID|Fixups|InsertFilter|Log|MapToStorage|TranslateName|TypeChecker)|Inherit|InputFilter|MapHandler|OutputFilter|PackageCPath|PackagePath|QuickHandler|Root|Scope)|Max(?:ConnectionsPerChild|KeepAliveRequests|MemFree|RangeOverlaps|RangeReversals|Ranges|RequestWorkers|SpareServers|SpareThreads|Threads)|MergeTrailers|MetaDir|MetaFiles|MetaSuffix|MimeMagicFile|MinSpareServers|MinSpareThreads|MMapFile|ModemStandard|ModMimeUsePathInfo|MultiviewsMatch|Mutex|NameVirtualHost|NoProxy|NWSSLTrustedCerts|NWSSLUpgradeable|Options|Order|OutputSed|PassEnv|PidFile|PrivilegesMode|Protocol|ProtocolEcho|Proxy(?:AddHeaders|BadHeader|Block|Domain|ErrorOverride|ExpressDBMFile|ExpressDBMType|ExpressEnable|FtpDirCharset|FtpEscapeWildcards|FtpListOnWildcard|HTML(?:BufSize|CharsetOut|DocType|Enable|Events|Extended|Fixups|Interp|Links|Meta|StripComments|URLMap)|IOBufferSize|MaxForwards|Pass(?:Inherit|InterpolateEnv|Match|Reverse|ReverseCookieDomain|ReverseCookiePath)?|PreserveHost|ReceiveBufferSize|Remote|RemoteMatch|Requests|SCGIInternalRedirect|SCGISendfile|Set|SourceAddress|Status|Timeout|Via)|ReadmeName|ReceiveBufferSize|Redirect|RedirectMatch|RedirectPermanent|RedirectTemp|ReflectorHeader|RemoteIP(?:Header|InternalProxy|InternalProxyList|ProxiesHeader|TrustedProxy|TrustedProxyList)|RemoveCharset|RemoveEncoding|RemoveHandler|RemoveInputFilter|RemoveLanguage|RemoveOutputFilter|RemoveType|RequestHeader|RequestReadTimeout|Require|Rewrite(?:Base|Cond|Engine|Map|Options|Rule)|RLimitCPU|RLimitMEM|RLimitNPROC|Satisfy|ScoreBoardFile|Script(?:Alias|AliasMatch|InterpreterSource|Log|LogBuffer|LogLength|Sock)?|SecureListen|SeeRequestTail|SendBufferSize|Server(?:Admin|Alias|Limit|Name|Path|Root|Signature|Tokens)|Session(?:Cookie(?:Name|Name2|Remove)|Crypto(?:Cipher|Driver|Passphrase|PassphraseFile)|DBD(?:CookieName|CookieName2|CookieRemove|DeleteLabel|InsertLabel|PerUser|SelectLabel|UpdateLabel)|Env|Exclude|Header|Include|MaxAge)?|SetEnv|SetEnvIf|SetEnvIfExpr|SetEnvIfNoCase|SetHandler|SetInputFilter|SetOutputFilter|SSIEndTag|SSIErrorMsg|SSIETag|SSILastModified|SSILegacyExprParser|SSIStartTag|SSITimeFormat|SSIUndefinedEcho|SSL(?:CACertificateFile|CACertificatePath|CADNRequestFile|CADNRequestPath|CARevocationCheck|CARevocationFile|CARevocationPath|CertificateChainFile|CertificateFile|CertificateKeyFile|CipherSuite|Compression|CryptoDevice|Engine|FIPS|HonorCipherOrder|InsecureRenegotiation|OCSP(?:DefaultResponder|Enable|OverrideResponder|ResponderTimeout|ResponseMaxAge|ResponseTimeSkew|UseRequestNonce)|OpenSSLConfCmd|Options|PassPhraseDialog|Protocol|Proxy(?:CACertificateFile|CACertificatePath|CARevocation(?:Check|File|Path)|CheckPeer(?:CN|Expire|Name)|CipherSuite|Engine|MachineCertificate(?:ChainFile|File|Path)|Protocol|Verify|VerifyDepth)|RandomSeed|RenegBufferSize|Require|RequireSSL|Session(?:Cache|CacheTimeout|TicketKeyFile|Tickets)|SRPUnknownUserSeed|SRPVerifierFile|Stapling(?:Cache|ErrorCacheTimeout|FakeTryLater|ForceURL|ResponderTimeout|ResponseMaxAge|ResponseTimeSkew|ReturnResponderErrors|StandardCacheTimeout)|StrictSNIVHostCheck|UserName|UseStapling|VerifyClient|VerifyDepth)|StartServers|StartThreads|Substitute|Suexec|SuexecUserGroup|ThreadLimit|ThreadsPerChild|ThreadStackSize|TimeOut|TraceEnable|TransferLog|TypesConfig|UnDefine|UndefMacro|UnsetEnv|Use|UseCanonicalName|UseCanonicalPhysicalPort|User|UserDir|VHostCGIMode|VHostCGIPrivs|VHostGroup|VHostPrivs|VHostSecure|VHostUser|Virtual(?:DocumentRoot|ScriptAlias)(?:IP)?|WatchdogInterval|XBitHack|xml2EncAlias|xml2EncDefault|xml2StartParse)\b/im,
      lookbehind: true,
      alias: 'property',
    },
    'directive-block': {
      pattern: /<\/?\b(?:Auth[nz]ProviderAlias|Directory|DirectoryMatch|Else|ElseIf|Files|FilesMatch|If|IfDefine|IfModule|IfVersion|Limit|LimitExcept|Location|LocationMatch|Macro|Proxy|Require(?:All|Any|None)|VirtualHost)\b.*>/i,
      inside: {
        'directive-block': {
          pattern: /^<\/?\w+/,
          inside: {
            punctuation: /^<\/?/,
          },
          alias: 'tag',
        },
        'directive-block-parameter': {
          pattern: /.*[^>]/,
          inside: {
            punctuation: /:/,
            string: {
              pattern: /("|').*\1/,
              inside: {
                variable: /[$%]\{?(?:\w\.?[-+:]?)+\}?/,
              },
            },
          },
          alias: 'attr-value',
        },
        punctuation: />/,
      },
      alias: 'tag',
    },
    'directive-flags': {
      pattern: /\[(?:[\w=],?)+\]/,
      alias: 'keyword',
    },
    string: {
      pattern: /("|').*\1/,
      inside: {
        variable: /[$%]\{?(?:\w\.?[-+:]?)+\}?/,
      },
    },
    variable: /[$%]\{?(?:\w\.?[-+:]?)+\}?/,
    regex: /\^?.*\$|\^.*\$?/,
  };

  (function (Prism) {
    /**
     * Replaces all placeholders "<<n>>" of given pattern with the n-th replacement (zero based).
     *
     * Note: This is a simple text based replacement. Be careful when using backreferences!
     *
     * @param {string} pattern the given pattern.
     * @param {string[]} replacements a list of replacement which can be inserted into the given pattern.
     * @returns {string} the pattern with all placeholders replaced with their corresponding replacements.
     * @example replace(/a<<0>>a/.source, [/b+/.source]) === /a(?:b+)a/.source
     */
    function replace(pattern, replacements) {
      return pattern.replace(/<<(\d+)>>/g, function (m, index) {
        return '(?:' + replacements[+index] + ')';
      });
    }

    /**
     * @param {string} pattern
     * @param {string[]} replacements
     * @param {string} [flags]
     * @returns {RegExp}
     */
    function re(pattern, replacements, flags) {
      return RegExp(replace(pattern, replacements), flags || '');
    }

    /**
     * Creates a nested pattern where all occurrences of the string `<<self>>` are replaced with the pattern itself.
     *
     * @param {string} pattern
     * @param {number} depthLog2
     * @returns {string}
     */
    function nested(pattern, depthLog2) {
      for (var i = 0; i < depthLog2; i++) {
        pattern = pattern.replace(/<<self>>/g, function () {
          return '(?:' + pattern + ')';
        });
      }
      return pattern.replace(/<<self>>/g, '[^\\s\\S]');
    }

    // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/
    var keywordKinds = {
      // keywords which represent a return or variable type
      type:
          'bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void',
      // keywords which are used to declare a type
      typeDeclaration: 'class enum interface record struct',
      // contextual keywords
      // ("var" and "dynamic" are missing because they are used like types)
      contextual:
          'add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)',
      // all other keywords
      other:
          'abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield',
    };

    // keywords
    function keywordsToPattern(words) {
      return '\\b(?:' + words.trim().replace(/ /g, '|') + ')\\b';
    }

    var typeDeclarationKeywords = keywordsToPattern(
        keywordKinds.typeDeclaration
    );
    var keywords = RegExp(
        keywordsToPattern(
            keywordKinds.type +
            ' ' +
            keywordKinds.typeDeclaration +
            ' ' +
            keywordKinds.contextual +
            ' ' +
            keywordKinds.other
        )
    );
    var nonTypeKeywords = keywordsToPattern(
        keywordKinds.typeDeclaration +
        ' ' +
        keywordKinds.contextual +
        ' ' +
        keywordKinds.other
    );
    var nonContextualKeywords = keywordsToPattern(
        keywordKinds.type +
        ' ' +
        keywordKinds.typeDeclaration +
        ' ' +
        keywordKinds.other
    );

    // types
    var generic = nested(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source, 2); // the idea behind the other forbidden characters is to prevent false positives. Same for tupleElement.
    var nestedRound = nested(/\((?:[^()]|<<self>>)*\)/.source, 2);
    var name = /@?\b[A-Za-z_]\w*\b/.source;
    var genericName = replace(/<<0>>(?:\s*<<1>>)?/.source, [name, generic]);
    var identifier = replace(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source, [
      nonTypeKeywords,
      genericName,
    ]);
    var array = /\[\s*(?:,\s*)*\]/.source;
    var typeExpressionWithoutTuple = replace(
        /<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source,
        [identifier, array]
    );
    var tupleElement = replace(
        /[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source,
        [generic, nestedRound, array]
    );
    var tuple = replace(/\(<<0>>+(?:,<<0>>+)+\)/.source, [tupleElement]);
    var typeExpression = replace(
        /(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source,
        [tuple, identifier, array]
    );

    var typeInside = {
      keyword: keywords,
      punctuation: /[<>()?,.:[\]]/,
    };

    // strings & characters
    // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#character-literals
    // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#string-literals
    var character = /'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source; // simplified pattern
    var regularString = /"(?:\\.|[^\\"\r\n])*"/.source;
    var verbatimString = /@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;

    Prism.languages.csharp = Prism.languages.extend('clike', {
      string: [
        {
          pattern: re(/(^|[^$\\])<<0>>/.source, [verbatimString]),
          lookbehind: true,
          greedy: true,
        },
        {
          pattern: re(/(^|[^@$\\])<<0>>/.source, [regularString]),
          lookbehind: true,
          greedy: true,
        },
      ],
      'class-name': [
        {
          // Using static
          // using static System.Math;
          pattern: re(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source, [
            identifier,
          ]),
          lookbehind: true,
          inside: typeInside,
        },
        {
          // Using alias (type)
          // using Project = PC.MyCompany.Project;
          pattern: re(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source, [
            name,
            typeExpression,
          ]),
          lookbehind: true,
          inside: typeInside,
        },
        {
          // Using alias (alias)
          // using Project = PC.MyCompany.Project;
          pattern: re(/(\busing\s+)<<0>>(?=\s*=)/.source, [name]),
          lookbehind: true,
        },
        {
          // Type declarations
          // class Foo<A, B>
          // interface Foo<out A, B>
          pattern: re(/(\b<<0>>\s+)<<1>>/.source, [
            typeDeclarationKeywords,
            genericName,
          ]),
          lookbehind: true,
          inside: typeInside,
        },
        {
          // Single catch exception declaration
          // catch(Foo)
          // (things like catch(Foo e) is covered by variable declaration)
          pattern: re(/(\bcatch\s*\(\s*)<<0>>/.source, [identifier]),
          lookbehind: true,
          inside: typeInside,
        },
        {
          // Name of the type parameter of generic constraints
          // where Foo : class
          pattern: re(/(\bwhere\s+)<<0>>/.source, [name]),
          lookbehind: true,
        },
        {
          // Casts and checks via as and is.
          // as Foo<A>, is Bar<B>
          // (things like if(a is Foo b) is covered by variable declaration)
          pattern: re(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source, [
            typeExpressionWithoutTuple,
          ]),
          lookbehind: true,
          inside: typeInside,
        },
        {
          // Variable, field and parameter declaration
          // (Foo bar, Bar baz, Foo[,,] bay, Foo<Bar, FooBar<Bar>> bax)
          pattern: re(
              /\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/
                  .source,
              [typeExpression, nonContextualKeywords, name]
          ),
          inside: typeInside,
        },
      ],
      keyword: keywords,
      // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#literals
      number: /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,
      operator: />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
      punctuation: /\?\.?|::|[{}[\];(),.:]/,
    });

    Prism.languages.insertBefore('csharp', 'number', {
      range: {
        pattern: /\.\./,
        alias: 'operator',
      },
    });

    Prism.languages.insertBefore('csharp', 'punctuation', {
      'named-parameter': {
        pattern: re(/([(,]\s*)<<0>>(?=\s*:)/.source, [name]),
        lookbehind: true,
        alias: 'punctuation',
      },
    });

    Prism.languages.insertBefore('csharp', 'class-name', {
      namespace: {
        // namespace Foo.Bar {}
        // using Foo.Bar;
        pattern: re(
            /(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source,
            [name]
        ),
        lookbehind: true,
        inside: {
          punctuation: /\./,
        },
      },
      'type-expression': {
        // default(Foo), typeof(Foo<Bar>), sizeof(int)
        pattern: re(
            /(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/
                .source,
            [nestedRound]
        ),
        lookbehind: true,
        alias: 'class-name',
        inside: typeInside,
      },
      'return-type': {
        // Foo<Bar> ForBar(); Foo IFoo.Bar() => 0
        // int this[int index] => 0; T IReadOnlyList<T>.this[int index] => this[index];
        // int Foo => 0; int Foo { get; set } = 0;
        pattern: re(
            /<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source,
            [typeExpression, identifier]
        ),
        inside: typeInside,
        alias: 'class-name',
      },
      'constructor-invocation': {
        // new List<Foo<Bar[]>> { }
        pattern: re(/(\bnew\s+)<<0>>(?=\s*[[({])/.source, [typeExpression]),
        lookbehind: true,
        inside: typeInside,
        alias: 'class-name',
      },
      /*'explicit-implementation': {
			// int IFoo<Foo>.Bar => 0; void IFoo<Foo<Foo>>.Foo<T>();
			pattern: replace(/\b<<0>>(?=\.<<1>>)/, className, methodOrPropertyDeclaration),
			inside: classNameInside,
			alias: 'class-name'
		},*/
      'generic-method': {
        // foo<Bar>()
        pattern: re(/<<0>>\s*<<1>>(?=\s*\()/.source, [name, generic]),
        inside: {
          function: re(/^<<0>>/.source, [name]),
          generic: {
            pattern: RegExp(generic),
            alias: 'class-name',
            inside: typeInside,
          },
        },
      },
      'type-list': {
        // The list of types inherited or of generic constraints
        // class Foo<F> : Bar, IList<FooBar>
        // where F : Bar, IList<int>
        pattern: re(
            /\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/
                .source,
            [
              typeDeclarationKeywords,
              genericName,
              name,
              typeExpression,
              keywords.source,
              nestedRound,
              /\bnew\s*\(\s*\)/.source,
            ]
        ),
        lookbehind: true,
        inside: {
          'record-arguments': {
            pattern: re(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source, [
              genericName,
              nestedRound,
            ]),
            lookbehind: true,
            greedy: true,
            inside: Prism.languages.csharp,
          },
          keyword: keywords,
          'class-name': {
            pattern: RegExp(typeExpression),
            greedy: true,
            inside: typeInside,
          },
          punctuation: /[,()]/,
        },
      },
      preprocessor: {
        pattern: /(^[\t ]*)#.*/m,
        lookbehind: true,
        alias: 'property',
        inside: {
          // highlight preprocessor directives as keywords
          directive: {
            pattern: /(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,
            lookbehind: true,
            alias: 'keyword',
          },
        },
      },
    });

    // attributes
    var regularStringOrCharacter = regularString + '|' + character;
    var regularStringCharacterOrComment = replace(
        /\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source,
        [regularStringOrCharacter]
    );
    var roundExpression = nested(
        replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [
          regularStringCharacterOrComment,
        ]),
        2
    );

    // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/attributes/#attribute-targets
    var attrTarget = /\b(?:assembly|event|field|method|module|param|property|return|type)\b/
        .source;
    var attr = replace(/<<0>>(?:\s*\(<<1>>*\))?/.source, [
      identifier,
      roundExpression,
    ]);

    Prism.languages.insertBefore('csharp', 'class-name', {
      attribute: {
        // Attributes
        // [Foo], [Foo(1), Bar(2, Prop = "foo")], [return: Foo(1), Bar(2)], [assembly: Foo(Bar)]
        pattern: re(
            /((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/
                .source,
            [attrTarget, attr]
        ),
        lookbehind: true,
        greedy: true,
        inside: {
          target: {
            pattern: re(/^<<0>>(?=\s*:)/.source, [attrTarget]),
            alias: 'keyword',
          },
          'attribute-arguments': {
            pattern: re(/\(<<0>>*\)/.source, [roundExpression]),
            inside: Prism.languages.csharp,
          },
          'class-name': {
            pattern: RegExp(identifier),
            inside: {
              punctuation: /\./,
            },
          },
          punctuation: /[:,]/,
        },
      },
    });

    // string interpolation
    var formatString = /:[^}\r\n]+/.source;
    // multi line
    var mInterpolationRound = nested(
        replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [
          regularStringCharacterOrComment,
        ]),
        2
    );
    var mInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [
      mInterpolationRound,
      formatString,
    ]);
    // single line
    var sInterpolationRound = nested(
        replace(
            /[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/
                .source,
            [regularStringOrCharacter]
        ),
        2
    );
    var sInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [
      sInterpolationRound,
      formatString,
    ]);

    function createInterpolationInside(interpolation, interpolationRound) {
      return {
        interpolation: {
          pattern: re(/((?:^|[^{])(?:\{\{)*)<<0>>/.source, [interpolation]),
          lookbehind: true,
          inside: {
            'format-string': {
              pattern: re(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source, [
                interpolationRound,
                formatString,
              ]),
              lookbehind: true,
              inside: {
                punctuation: /^:/,
              },
            },
            punctuation: /^\{|\}$/,
            expression: {
              pattern: /[\s\S]+/,
              alias: 'language-csharp',
              inside: Prism.languages.csharp,
            },
          },
        },
        string: /[\s\S]+/,
      };
    }

    Prism.languages.insertBefore('csharp', 'string', {
      'interpolation-string': [
        {
          pattern: re(
              /(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source,
              [mInterpolation]
          ),
          lookbehind: true,
          greedy: true,
          inside: createInterpolationInside(
              mInterpolation,
              mInterpolationRound
          ),
        },
        {
          pattern: re(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source, [
            sInterpolation,
          ]),
          lookbehind: true,
          greedy: true,
          inside: createInterpolationInside(
              sInterpolation,
              sInterpolationRound
          ),
        },
      ],
      char: {
        pattern: RegExp(character),
        greedy: true,
      },
    });

    Prism.languages.dotnet = Prism.languages.cs = Prism.languages.csharp;
  })(Prism);

  Prism.languages.aspnet = Prism.languages.extend('markup', {
    'page-directive': {
      pattern: /<%\s*@.*%>/,
      alias: 'tag',
      inside: {
        'page-directive': {
          pattern: /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
          alias: 'tag',
        },
        rest: Prism.languages.markup.tag.inside,
      },
    },
    directive: {
      pattern: /<%.*%>/,
      alias: 'tag',
      inside: {
        directive: {
          pattern: /<%\s*?[$=%#:]{0,2}|%>/,
          alias: 'tag',
        },
        rest: Prism.languages.csharp,
      },
    },
  });
  // Regexp copied from prism-markup, with a negative look-ahead added
  Prism.languages.aspnet.tag.pattern = /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/;

  // match directives of attribute value foo="<% Bar %>"
  Prism.languages.insertBefore(
      'inside',
      'punctuation',
      {
        directive: Prism.languages.aspnet['directive'],
      },
      Prism.languages.aspnet.tag.inside['attr-value']
  );

  Prism.languages.insertBefore('aspnet', 'comment', {
    'asp-comment': {
      pattern: /<%--[\s\S]*?--%>/,
      alias: ['asp', 'comment'],
    },
  });

  // script runat="server" contains csharp, not javascript
  Prism.languages.insertBefore(
      'aspnet',
      Prism.languages.javascript ? 'script' : 'tag',
      {
        'asp-script': {
          pattern: /(<script(?=.*runat=['"]?server\b)[^>]*>)[\s\S]*?(?=<\/script>)/i,
          lookbehind: true,
          alias: ['asp', 'script'],
          inside: Prism.languages.csharp || {},
        },
      }
  );

  Prism.languages.awk = {
    hashbang: {
      pattern: /^#!.*/,
      greedy: true,
      alias: 'comment',
    },
    comment: {
      pattern: /#.*/,
      greedy: true,
    },
    string: {
      pattern: /(^|[^\\])"(?:[^\\"\r\n]|\\.)*"/,
      lookbehind: true,
      greedy: true,
    },
    regex: {
      pattern: /((?:^|[^\w\s)])\s*)\/(?:[^\/\\\r\n]|\\.)*\//,
      lookbehind: true,
      greedy: true,
    },

    variable: /\$\w+/,
    keyword: /\b(?:BEGIN|BEGINFILE|END|ENDFILE|break|case|continue|default|delete|do|else|exit|for|function|getline|if|in|next|nextfile|printf?|return|switch|while)\b|@(?:include|load)\b/,

    function: /\b[a-z_]\w*(?=\s*\()/i,
    number: /\b(?:\d+(?:\.\d+)?(?:e[+-]?\d+)?|0x[a-fA-F0-9]+)\b/,

    operator: /--|\+\+|!?~|>&|>>|<<|(?:\*\*|[<>!=+\-*/%^])=?|&&|\|[|&]|[?:]/,
    punctuation: /[()[\]{},;]/,
  };

  Prism.languages.gawk = Prism.languages.awk;

  (function (Prism) {
    // $ set | grep '^[A-Z][^[:space:]]*=' | cut -d= -f1 | tr '\n' '|'
    // + LC_ALL, RANDOM, REPLY, SECONDS.
    // + make sure PS1..4 are here as they are not always set,
    // - some useless things.
    var envVars =
        '\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b';

    var commandAfterHeredoc = {
      pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
      lookbehind: true,
      alias: 'punctuation', // this looks reasonably well in all themes
      inside: null, // see below
    };

    var insideString = {
      bash: commandAfterHeredoc,
      environment: {
        pattern: RegExp('\\$' + envVars),
        alias: 'constant',
      },
      variable: [
        // [0]: Arithmetic Environment
        {
          pattern: /\$?\(\([\s\S]+?\)\)/,
          greedy: true,
          inside: {
            // If there is a $ sign at the beginning highlight $(( and )) as variable
            variable: [
              {
                pattern: /(^\$\(\([\s\S]+)\)\)/,
                lookbehind: true,
              },
              /^\$\(\(/,
            ],
            number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
            // Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
            operator: /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
            // If there is no $ sign at the beginning highlight (( and )) as punctuation
            punctuation: /\(\(?|\)\)?|,|;/,
          },
        },
        // [1]: Command Substitution
        {
          pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
          greedy: true,
          inside: {
            variable: /^\$\(|^`|\)$|`$/,
          },
        },
        // [2]: Brace expansion
        {
          pattern: /\$\{[^}]+\}/,
          greedy: true,
          inside: {
            operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
            punctuation: /[\[\]]/,
            environment: {
              pattern: RegExp('(\\{)' + envVars),
              lookbehind: true,
              alias: 'constant',
            },
          },
        },
        /\$(?:\w+|[#?*!@$])/,
      ],
      // Escape sequences from echo and printf's manuals, and escaped quotes.
      entity: /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/,
    };

    Prism.languages.bash = {
      shebang: {
        pattern: /^#!\s*\/.*/,
        alias: 'important',
      },
      comment: {
        pattern: /(^|[^"{\\$])#.*/,
        lookbehind: true,
      },
      'function-name': [
        // a) function foo {
        // b) foo() {
        // c) function foo() {
        // but not “foo {”
        {
          // a) and c)
          pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
          lookbehind: true,
          alias: 'function',
        },
        {
          // b)
          pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/,
          alias: 'function',
        },
      ],
      // Highlight variable names as variables in for and select beginnings.
      'for-or-select': {
        pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
        alias: 'variable',
        lookbehind: true,
      },
      // Highlight variable names as variables in the left-hand part
      // of assignments (“=” and “+=”).
      'assign-left': {
        pattern: /(^|[\s;|&]|[<>]\()\w+(?=\+?=)/,
        inside: {
          environment: {
            pattern: RegExp('(^|[\\s;|&]|[<>]\\()' + envVars),
            lookbehind: true,
            alias: 'constant',
          },
        },
        alias: 'variable',
        lookbehind: true,
      },
      string: [
        // Support for Here-documents https://en.wikipedia.org/wiki/Here_document
        {
          pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
          lookbehind: true,
          greedy: true,
          inside: insideString,
        },
        // Here-document with quotes around the tag
        // → No expansion (so no “inside”).
        {
          pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
          lookbehind: true,
          greedy: true,
          inside: {
            bash: commandAfterHeredoc,
          },
        },
        // “Normal” string
        {
          // https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html
          pattern: /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
          lookbehind: true,
          greedy: true,
          inside: insideString,
        },
        {
          // https://www.gnu.org/software/bash/manual/html_node/Single-Quotes.html
          pattern: /(^|[^$\\])'[^']*'/,
          lookbehind: true,
          greedy: true,
        },
        {
          // https://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html
          pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
          greedy: true,
          inside: {
            entity: insideString.entity,
          },
        },
      ],
      environment: {
        pattern: RegExp('\\$?' + envVars),
        alias: 'constant',
      },
      variable: insideString.variable,
      function: {
        pattern: /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
        lookbehind: true,
      },
      keyword: {
        pattern: /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
        lookbehind: true,
      },
      // https://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
      builtin: {
        pattern: /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
        lookbehind: true,
        // Alias added to make those easier to distinguish from strings.
        alias: 'class-name',
      },
      boolean: {
        pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
        lookbehind: true,
      },
      'file-descriptor': {
        pattern: /\B&\d\b/,
        alias: 'important',
      },
      operator: {
        // Lots of redirections here, but not just that.
        pattern: /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
        inside: {
          'file-descriptor': {
            pattern: /^\d/,
            alias: 'important',
          },
        },
      },
      punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
      number: {
        pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
        lookbehind: true,
      },
    };

    commandAfterHeredoc.inside = Prism.languages.bash;

    /* Patterns in command substitution. */
    var toBeCopied = [
      'comment',
      'function-name',
      'for-or-select',
      'assign-left',
      'string',
      'environment',
      'function',
      'keyword',
      'builtin',
      'boolean',
      'file-descriptor',
      'operator',
      'punctuation',
      'number',
    ];
    var inside = insideString.variable[1].inside;
    for (var i = 0; i < toBeCopied.length; i++) {
      inside[toBeCopied[i]] = Prism.languages.bash[toBeCopied[i]];
    }

    Prism.languages.shell = Prism.languages.bash;
  })(Prism);

  Prism.languages.c = Prism.languages.extend('clike', {
    comment: {
      pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
      greedy: true,
    },
    string: {
      // https://en.cppreference.com/w/c/language/string_literal
      pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
      greedy: true,
    },
    'class-name': {
      pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
      lookbehind: true,
    },
    keyword: /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
    function: /\b[a-z_]\w*(?=\s*\()/i,
    number: /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
    operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
  });

  Prism.languages.insertBefore('c', 'string', {
    char: {
      // https://en.cppreference.com/w/c/language/character_constant
      pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
      greedy: true,
    },
  });

  Prism.languages.insertBefore('c', 'string', {
    macro: {
      // allow for multiline macro definitions
      // spaces after the # character compile fine with gcc
      pattern: /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
      lookbehind: true,
      greedy: true,
      alias: 'property',
      inside: {
        string: [
          {
            // highlight the path of the include statement as a string
            pattern: /^(#\s*include\s*)<[^>]+>/,
            lookbehind: true,
          },
          Prism.languages.c['string'],
        ],
        char: Prism.languages.c['char'],
        comment: Prism.languages.c['comment'],
        'macro-name': [
          {
            pattern: /(^#\s*define\s+)\w+\b(?!\()/i,
            lookbehind: true,
          },
          {
            pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
            lookbehind: true,
            alias: 'function',
          },
        ],
        // highlight macro directives as keywords
        directive: {
          pattern: /^(#\s*)[a-z]+/,
          lookbehind: true,
          alias: 'keyword',
        },
        'directive-hash': /^#/,
        punctuation: /##|\\(?=[\r\n])/,
        expression: {
          pattern: /\S[\s\S]*/,
          inside: Prism.languages.c,
        },
      },
    },
  });

  Prism.languages.insertBefore('c', 'function', {
    // highlight predefined macros as constants
    constant: /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/,
  });

  delete Prism.languages.c['boolean'];

  (function (Prism) {
    var keyword = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/;
    var modName = /\b(?!<keyword>)\w+(?:\s*\.\s*\w+)*\b/.source.replace(
        /<keyword>/g,
        function () {
          return keyword.source;
        }
    );

    Prism.languages.cpp = Prism.languages.extend('c', {
      'class-name': [
        {
          pattern: RegExp(
              /(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source.replace(
                  /<keyword>/g,
                  function () {
                    return keyword.source;
                  }
              )
          ),
          lookbehind: true,
        },
        // This is intended to capture the class name of method implementations like:
        //   void foo::bar() const {}
        // However! The `foo` in the above example could also be a namespace, so we only capture the class name if
        // it starts with an uppercase letter. This approximation should give decent results.
        /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
        // This will capture the class name before destructors like:
        //   Foo::~Foo() {}
        /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
        // This also intends to capture the class name of method implementations but here the class has template
        // parameters, so it can't be a namespace (until C++ adds generic namespaces).
        /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/,
      ],
      keyword: keyword,
      number: {
        pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
        greedy: true,
      },
      operator: />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
      boolean: /\b(?:false|true)\b/,
    });

    Prism.languages.insertBefore('cpp', 'string', {
      module: {
        // https://en.cppreference.com/w/cpp/language/modules
        pattern: RegExp(
            /(\b(?:import|module)\s+)/.source +
            '(?:' +
            // header-name
            /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|<[^<>\r\n]*>/.source +
            '|' +
            // module name or partition or both
            /<mod-name>(?:\s*:\s*<mod-name>)?|:\s*<mod-name>/.source.replace(
                /<mod-name>/g,
                function () {
                  return modName;
                }
            ) +
            ')'
        ),
        lookbehind: true,
        greedy: true,
        inside: {
          string: /^[<"][\s\S]+/,
          operator: /:/,
          punctuation: /\./,
        },
      },
      'raw-string': {
        pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
        alias: 'string',
        greedy: true,
      },
    });

    Prism.languages.insertBefore('cpp', 'keyword', {
      'generic-function': {
        pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
        inside: {
          function: /^\w+/,
          generic: {
            pattern: /<[\s\S]+/,
            alias: 'class-name',
            inside: Prism.languages.cpp,
          },
        },
      },
    });

    Prism.languages.insertBefore('cpp', 'operator', {
      'double-colon': {
        pattern: /::/,
        alias: 'punctuation',
      },
    });

    Prism.languages.insertBefore('cpp', 'class-name', {
      // the base clause is an optional list of parent classes
      // https://en.cppreference.com/w/cpp/language/class
      'base-clause': {
        pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
        lookbehind: true,
        greedy: true,
        inside: Prism.languages.extend('cpp', {}),
      },
    });

    Prism.languages.insertBefore(
        'inside',
        'double-colon',
        {
          // All untokenized words that are not namespaces should be class names
          'class-name': /\b[a-z_]\w*\b(?!\s*::)/i,
        },
        Prism.languages.cpp['base-clause']
    );
  })(Prism);

  (function (Prism) {
    var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
    var selectorInside;

    Prism.languages.css.selector = {
      pattern: Prism.languages.css.selector.pattern,
      lookbehind: true,
      inside: (selectorInside = {
        'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
        'pseudo-class': /:[-\w]+/,
        class: /\.[-\w]+/,
        id: /#[-\w]+/,
        attribute: {
          pattern: RegExp('\\[(?:[^[\\]"\']|' + string.source + ')*\\]'),
          greedy: true,
          inside: {
            punctuation: /^\[|\]$/,
            'case-sensitivity': {
              pattern: /(\s)[si]$/i,
              lookbehind: true,
              alias: 'keyword',
            },
            namespace: {
              pattern: /^(\s*)(?:(?!\s)[-*\w\xA0-\uFFFF])*\|(?!=)/,
              lookbehind: true,
              inside: {
                punctuation: /\|$/,
              },
            },
            'attr-name': {
              pattern: /^(\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+/,
              lookbehind: true,
            },
            'attr-value': [
              string,
              {
                pattern: /(=\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+(?=\s*$)/,
                lookbehind: true,
              },
            ],
            operator: /[|~*^$]?=/,
          },
        },
        'n-th': [
          {
            pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
            lookbehind: true,
            inside: {
              number: /[\dn]+/,
              operator: /[+-]/,
            },
          },
          {
            pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i,
            lookbehind: true,
          },
        ],
        combinator: />|\+|~|\|\|/,

        // the `tag` token has been existed and removed.
        // because we can't find a perfect tokenize to match it.
        // if you want to add it, please read https://github.com/PrismJS/prism/pull/2373 first.

        punctuation: /[(),]/,
      }),
    };

    Prism.languages.css['atrule'].inside[
        'selector-function-argument'
        ].inside = selectorInside;

    Prism.languages.insertBefore('css', 'property', {
      variable: {
        pattern: /(^|[^-\w\xA0-\uFFFF])--(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*/i,
        lookbehind: true,
      },
    });

    var unit = {
      pattern: /(\b\d+)(?:%|[a-z]+(?![\w-]))/,
      lookbehind: true,
    };
    // 123 -123 .123 -.123 12.3 -12.3
    var number = {
      pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/,
      lookbehind: true,
    };

    Prism.languages.insertBefore('css', 'function', {
      operator: {
        pattern: /(\s)[+\-*\/](?=\s)/,
        lookbehind: true,
      },
      // CAREFUL!
      // Previewers and Inline color use hexcode and color.
      hexcode: {
        pattern: /\B#[\da-f]{3,8}\b/i,
        alias: 'color',
      },
      color: [
        {
          pattern: /(^|[^\w-])(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)(?![\w-])/i,
          lookbehind: true,
        },
        {
          pattern: /\b(?:hsl|rgb)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:hsl|rgb)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
          inside: {
            unit: unit,
            number: number,
            function: /[\w-]+(?=\()/,
            punctuation: /[(),]/,
          },
        },
      ],
      // it's important that there is no boundary assertion after the hex digits
      entity: /\\[\da-f]{1,8}/i,
      unit: unit,
      number: number,
    });
  })(Prism);

  // https://tools.ietf.org/html/rfc4180

  Prism.languages.csv = {
    value: /[^\r\n,"]+|"(?:[^"]|"")*"(?!")/,
    punctuation: /,/,
  };

  (function (Prism) {
    // Many of the following regexes will contain negated lookaheads like `[ \t]+(?![ \t])`. This is a trick to ensure
    // that quantifiers behave *atomically*. Atomic quantifiers are necessary to prevent exponential backtracking.

    var spaceAfterBackSlash = /\\[\r\n](?:\s|\\[\r\n]|#.*(?!.))*(?![\s#]|\\[\r\n])/
        .source;
    // At least one space, comment, or line break
    var space = /(?:[ \t]+(?![ \t])(?:<SP_BS>)?|<SP_BS>)/.source.replace(
        /<SP_BS>/g,
        function () {
          return spaceAfterBackSlash;
        }
    );

    var string = /"(?:[^"\\\r\n]|\\(?:\r\n|[\s\S]))*"|'(?:[^'\\\r\n]|\\(?:\r\n|[\s\S]))*'/
        .source;
    var option = /--[\w-]+=(?:<STR>|(?!["'])(?:[^\s\\]|\\.)+)/.source.replace(
        /<STR>/g,
        function () {
          return string;
        }
    );

    var stringRule = {
      pattern: RegExp(string),
      greedy: true,
    };
    var commentRule = {
      pattern: /(^[ \t]*)#.*/m,
      lookbehind: true,
      greedy: true,
    };

    /**
     * @param {string} source
     * @param {string} flags
     * @returns {RegExp}
     */
    function re(source, flags) {
      source = source
          .replace(/<OPT>/g, function () {
            return option;
          })
          .replace(/<SP>/g, function () {
            return space;
          });

      return RegExp(source, flags);
    }

    Prism.languages.docker = {
      instruction: {
        pattern: /(^[ \t]*)(?:ADD|ARG|CMD|COPY|ENTRYPOINT|ENV|EXPOSE|FROM|HEALTHCHECK|LABEL|MAINTAINER|ONBUILD|RUN|SHELL|STOPSIGNAL|USER|VOLUME|WORKDIR)(?=\s)(?:\\.|[^\r\n\\])*(?:\\$(?:\s|#.*$)*(?![\s#])(?:\\.|[^\r\n\\])*)*/im,
        lookbehind: true,
        greedy: true,
        inside: {
          options: {
            pattern: re(
                /(^(?:ONBUILD<SP>)?\w+<SP>)<OPT>(?:<SP><OPT>)*/.source,
                'i'
            ),
            lookbehind: true,
            greedy: true,
            inside: {
              property: {
                pattern: /(^|\s)--[\w-]+/,
                lookbehind: true,
              },
              string: [
                stringRule,
                {
                  pattern: /(=)(?!["'])(?:[^\s\\]|\\.)+/,
                  lookbehind: true,
                },
              ],
              operator: /\\$/m,
              punctuation: /=/,
            },
          },
          keyword: [
            {
              // https://docs.docker.com/engine/reference/builder/#healthcheck
              pattern: re(
                  /(^(?:ONBUILD<SP>)?HEALTHCHECK<SP>(?:<OPT><SP>)*)(?:CMD|NONE)\b/
                      .source,
                  'i'
              ),
              lookbehind: true,
              greedy: true,
            },
            {
              // https://docs.docker.com/engine/reference/builder/#from
              pattern: re(
                  /(^(?:ONBUILD<SP>)?FROM<SP>(?:<OPT><SP>)*(?!--)[^ \t\\]+<SP>)AS/
                      .source,
                  'i'
              ),
              lookbehind: true,
              greedy: true,
            },
            {
              // https://docs.docker.com/engine/reference/builder/#onbuild
              pattern: re(/(^ONBUILD<SP>)\w+/.source, 'i'),
              lookbehind: true,
              greedy: true,
            },
            {
              pattern: /^\w+/,
              greedy: true,
            },
          ],
          comment: commentRule,
          string: stringRule,
          variable: /\$(?:\w+|\{[^{}"'\\]*\})/,
          operator: /\\$/m,
        },
      },
      comment: commentRule,
    };

    Prism.languages.dockerfile = Prism.languages.docker;
  })(Prism);

  (function (Prism) {
    /**
     * Returns the placeholder for the given language id and index.
     *
     * @param {string} language
     * @param {string|number} index
     * @returns {string}
     */
    function getPlaceholder(language, index) {
      return '___' + language.toUpperCase() + index + '___';
    }

    Object.defineProperties((Prism.languages['markup-templating'] = {}), {
      buildPlaceholders: {
        /**
         * Tokenize all inline templating expressions matching `placeholderPattern`.
         *
         * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
         * `true` will be replaced.
         *
         * @param {object} env The environment of the `before-tokenize` hook.
         * @param {string} language The language id.
         * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
         * @param {(match: string) => boolean} [replaceFilter]
         */
        value: function (env, language, placeholderPattern, replaceFilter) {
          if (env.language !== language) {
            return;
          }

          var tokenStack = (env.tokenStack = []);

          env.code = env.code.replace(placeholderPattern, function (match) {
            if (typeof replaceFilter === 'function' && !replaceFilter(match)) {
              return match;
            }
            var i = tokenStack.length;
            var placeholder;

            // Check for existing strings
            while (
                env.code.indexOf((placeholder = getPlaceholder(language, i))) !==
                -1
                ) {
              ++i;
            }

            // Create a sparse array
            tokenStack[i] = match;

            return placeholder;
          });

          // Switch the grammar to markup
          env.grammar = Prism.languages.markup;
        },
      },
      tokenizePlaceholders: {
        /**
         * Replace placeholders with proper tokens after tokenizing.
         *
         * @param {object} env The environment of the `after-tokenize` hook.
         * @param {string} language The language id.
         */
        value: function (env, language) {
          if (env.language !== language || !env.tokenStack) {
            return;
          }

          // Switch the grammar back
          env.grammar = Prism.languages[language];

          var j = 0;
          var keys = Object.keys(env.tokenStack);

          function walkTokens(tokens) {
            for (var i = 0; i < tokens.length; i++) {
              // all placeholders are replaced already
              if (j >= keys.length) {
                break;
              }

              var token = tokens[i];
              if (
                  typeof token === 'string' ||
                  (token.content && typeof token.content === 'string')
              ) {
                var k = keys[j];
                var t = env.tokenStack[k];
                var s = typeof token === 'string' ? token : token.content;
                var placeholder = getPlaceholder(language, k);

                var index = s.indexOf(placeholder);
                if (index > -1) {
                  ++j;

                  var before = s.substring(0, index);
                  var middle = new Prism.Token(
                      language,
                      Prism.tokenize(t, env.grammar),
                      'language-' + language,
                      t
                  );
                  var after = s.substring(index + placeholder.length);

                  var replacement = [];
                  if (before) {
                    replacement.push.apply(replacement, walkTokens([before]));
                  }
                  replacement.push(middle);
                  if (after) {
                    replacement.push.apply(replacement, walkTokens([after]));
                  }

                  if (typeof token === 'string') {
                    tokens.splice.apply(tokens, [i, 1].concat(replacement));
                  } else {
                    token.content = replacement;
                  }
                }
              } else if (
                  token.content /* && typeof token.content !== 'string' */
              ) {
                walkTokens(token.content);
              }
            }

            return tokens;
          }

          walkTokens(env.tokens);
        },
      },
    });
  })(Prism);

  (function (Prism) {
    Prism.languages.ejs = {
      delimiter: {
        pattern: /^<%[-_=]?|[-_]?%>$/,
        alias: 'punctuation',
      },
      comment: /^#[\s\S]*/,
      'language-javascript': {
        pattern: /[\s\S]+/,
        inside: Prism.languages.javascript,
      },
    };

    Prism.hooks.add('before-tokenize', function (env) {
      var ejsPattern = /<%(?!%)[\s\S]+?%>/g;
      Prism.languages['markup-templating'].buildPlaceholders(
          env,
          'ejs',
          ejsPattern
      );
    });

    Prism.hooks.add('after-tokenize', function (env) {
      Prism.languages['markup-templating'].tokenizePlaceholders(env, 'ejs');
    });

    Prism.languages.eta = Prism.languages.ejs;
  })(Prism);

  Prism.languages.git = {
    /*
     * A simple one line comment like in a git status command
     * For instance:
     * $ git status
     * # On branch infinite-scroll
     * # Your branch and 'origin/sharedBranches/frontendTeam/infinite-scroll' have diverged,
     * # and have 1 and 2 different commits each, respectively.
     * nothing to commit (working directory clean)
     */
    comment: /^#.*/m,

    /*
     * Regexp to match the changed lines in a git diff output. Check the example below.
     */
    deleted: /^[-–].*/m,
    inserted: /^\+.*/m,

    /*
     * a string (double and simple quote)
     */
    string: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,

    /*
     * a git command. It starts with a random prompt finishing by a $, then "git" then some other parameters
     * For instance:
     * $ git add file.txt
     */
    command: {
      pattern: /^.*\$ git .*$/m,
      inside: {
        /*
         * A git command can contain a parameter starting by a single or a double dash followed by a string
         * For instance:
         * $ git diff --cached
         * $ git log -p
         */
        parameter: /\s--?\w+/,
      },
    },

    /*
     * Coordinates displayed in a git diff command
     * For instance:
     * $ git diff
     * diff --git file.txt file.txt
     * index 6214953..1d54a52 100644
     * --- file.txt
     * +++ file.txt
     * @@ -1 +1,2 @@
     * -Here's my tetx file
     * +Here's my text file
     * +And this is the second line
     */
    coord: /^@@.*@@$/m,

    /*
     * Match a "commit [SHA1]" line in a git log output.
     * For instance:
     * $ git log
     * commit a11a14ef7e26f2ca62d4b35eac455ce636d0dc09
     * Author: lgiraudel
     * Date:   Mon Feb 17 11:18:34 2014 +0100
     *
     *     Add of a new line
     */
    'commit-sha1': /^commit \w{40}$/m,
  };

  Prism.languages.graphql = {
    comment: /#.*/,
    description: {
      pattern: /(?:"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*")(?=\s*[a-z_])/i,
      greedy: true,
      alias: 'string',
      inside: {
        'language-markdown': {
          pattern: /(^"(?:"")?)(?!\1)[\s\S]+(?=\1$)/,
          lookbehind: true,
          inside: Prism.languages.markdown,
        },
      },
    },
    string: {
      pattern: /"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*"/,
      greedy: true,
    },
    number: /(?:\B-|\b)\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    boolean: /\b(?:false|true)\b/,
    variable: /\$[a-z_]\w*/i,
    directive: {
      pattern: /@[a-z_]\w*/i,
      alias: 'function',
    },
    'attr-name': {
      pattern: /\b[a-z_]\w*(?=\s*(?:\((?:[^()"]|"(?:\\.|[^\\"\r\n])*")*\))?:)/i,
      greedy: true,
    },
    'atom-input': {
      pattern: /\b[A-Z]\w*Input\b/,
      alias: 'class-name',
    },
    scalar: /\b(?:Boolean|Float|ID|Int|String)\b/,
    constant: /\b[A-Z][A-Z_\d]*\b/,
    'class-name': {
      pattern: /(\b(?:enum|implements|interface|on|scalar|type|union)\s+|&\s*|:\s*|\[)[A-Z_]\w*/,
      lookbehind: true,
    },
    fragment: {
      pattern: /(\bfragment\s+|\.{3}\s*(?!on\b))[a-zA-Z_]\w*/,
      lookbehind: true,
      alias: 'function',
    },
    'definition-mutation': {
      pattern: /(\bmutation\s+)[a-zA-Z_]\w*/,
      lookbehind: true,
      alias: 'function',
    },
    'definition-query': {
      pattern: /(\bquery\s+)[a-zA-Z_]\w*/,
      lookbehind: true,
      alias: 'function',
    },
    keyword: /\b(?:directive|enum|extend|fragment|implements|input|interface|mutation|on|query|repeatable|scalar|schema|subscription|type|union)\b/,
    operator: /[!=|&]|\.{3}/,
    'property-query': /\w+(?=\s*\()/,
    object: /\w+(?=\s*\{)/,
    punctuation: /[!(){}\[\]:=,]/,
    property: /\w+/,
  };

  Prism.hooks.add('after-tokenize', function afterTokenizeGraphql(env) {
    if (env.language !== 'graphql') {
      return;
    }

    /**
     * get the graphql token stream that we want to customize
     *
     * @typedef {InstanceType<import("./prism-core")["Token"]>} Token
     * @type {Token[]}
     */
    var validTokens = env.tokens.filter(function (token) {
      return (
          typeof token !== 'string' &&
          token.type !== 'comment' &&
          token.type !== 'scalar'
      );
    });

    var currentIndex = 0;

    /**
     * Returns whether the token relative to the current index has the given type.
     *
     * @param {number} offset
     * @returns {Token | undefined}
     */
    function getToken(offset) {
      return validTokens[currentIndex + offset];
    }

    /**
     * Returns whether the token relative to the current index has the given type.
     *
     * @param {readonly string[]} types
     * @param {number} [offset=0]
     * @returns {boolean}
     */
    function isTokenType(types, offset) {
      offset = offset || 0;
      for (var i = 0; i < types.length; i++) {
        var token = getToken(i + offset);
        if (!token || token.type !== types[i]) {
          return false;
        }
      }
      return true;
    }

    /**
     * Returns the index of the closing bracket to an opening bracket.
     *
     * It is assumed that `token[currentIndex - 1]` is an opening bracket.
     *
     * If no closing bracket could be found, `-1` will be returned.
     *
     * @param {RegExp} open
     * @param {RegExp} close
     * @returns {number}
     */
    function findClosingBracket(open, close) {
      var stackHeight = 1;

      for (var i = currentIndex; i < validTokens.length; i++) {
        var token = validTokens[i];
        var content = token.content;

        if (token.type === 'punctuation' && typeof content === 'string') {
          if (open.test(content)) {
            stackHeight++;
          } else if (close.test(content)) {
            stackHeight--;

            if (stackHeight === 0) {
              return i;
            }
          }
        }
      }

      return -1;
    }

    /**
     * Adds an alias to the given token.
     *
     * @param {Token} token
     * @param {string} alias
     * @returns {void}
     */
    function addAlias(token, alias) {
      var aliases = token.alias;
      if (!aliases) {
        token.alias = aliases = [];
      } else if (!Array.isArray(aliases)) {
        token.alias = aliases = [aliases];
      }
      aliases.push(alias);
    }

    for (; currentIndex < validTokens.length;) {
      var startToken = validTokens[currentIndex++];

      // add special aliases for mutation tokens
      if (startToken.type === 'keyword' && startToken.content === 'mutation') {
        // any array of the names of all input variables (if any)
        var inputVariables = [];

        if (
            isTokenType(['definition-mutation', 'punctuation']) &&
            getToken(1).content === '('
        ) {
          // definition

          currentIndex += 2; // skip 'definition-mutation' and 'punctuation'

          var definitionEnd = findClosingBracket(/^\($/, /^\)$/);
          if (definitionEnd === -1) {
            continue;
          }

          // find all input variables
          for (; currentIndex < definitionEnd; currentIndex++) {
            var t = getToken(0);
            if (t.type === 'variable') {
              addAlias(t, 'variable-input');
              inputVariables.push(t.content);
            }
          }

          currentIndex = definitionEnd + 1;
        }

        if (
            isTokenType(['punctuation', 'property-query']) &&
            getToken(0).content === '{'
        ) {
          currentIndex++; // skip opening bracket

          addAlias(getToken(0), 'property-mutation');

          if (inputVariables.length > 0) {
            var mutationEnd = findClosingBracket(/^\{$/, /^\}$/);
            if (mutationEnd === -1) {
              continue;
            }

            // give references to input variables a special alias
            for (var i = currentIndex; i < mutationEnd; i++) {
              var varToken = validTokens[i];
              if (
                  varToken.type === 'variable' &&
                  inputVariables.indexOf(varToken.content) >= 0
              ) {
                addAlias(varToken, 'variable-input');
              }
            }
          }
        }
      }
    }
  });

  (function (Prism) {
    /**
     * @param {string} name
     * @returns {RegExp}
     */
    function headerValueOf(name) {
      return RegExp('(^(?:' + name + '):[ \t]*(?![ \t]))[^]+', 'i');
    }

    Prism.languages.http = {
      'request-line': {
        pattern: /^(?:CONNECT|DELETE|GET|HEAD|OPTIONS|PATCH|POST|PRI|PUT|SEARCH|TRACE)\s(?:https?:\/\/|\/)\S*\sHTTP\/[\d.]+/m,
        inside: {
          // HTTP Method
          method: {
            pattern: /^[A-Z]+\b/,
            alias: 'property',
          },
          // Request Target e.g. http://example.com, /path/to/file
          'request-target': {
            pattern: /^(\s)(?:https?:\/\/|\/)\S*(?=\s)/,
            lookbehind: true,
            alias: 'url',
            inside: Prism.languages.uri,
          },
          // HTTP Version
          'http-version': {
            pattern: /^(\s)HTTP\/[\d.]+/,
            lookbehind: true,
            alias: 'property',
          },
        },
      },
      'response-status': {
        pattern: /^HTTP\/[\d.]+ \d+ .+/m,
        inside: {
          // HTTP Version
          'http-version': {
            pattern: /^HTTP\/[\d.]+/,
            alias: 'property',
          },
          // Status Code
          'status-code': {
            pattern: /^(\s)\d+(?=\s)/,
            lookbehind: true,
            alias: 'number',
          },
          // Reason Phrase
          'reason-phrase': {
            pattern: /^(\s).+/,
            lookbehind: true,
            alias: 'string',
          },
        },
      },
      header: {
        pattern: /^[\w-]+:.+(?:(?:\r\n?|\n)[ \t].+)*/m,
        inside: {
          'header-value': [
            {
              pattern: headerValueOf(/Content-Security-Policy/.source),
              lookbehind: true,
              alias: ['csp', 'languages-csp'],
              inside: Prism.languages.csp,
            },
            {
              pattern: headerValueOf(/Public-Key-Pins(?:-Report-Only)?/.source),
              lookbehind: true,
              alias: ['hpkp', 'languages-hpkp'],
              inside: Prism.languages.hpkp,
            },
            {
              pattern: headerValueOf(/Strict-Transport-Security/.source),
              lookbehind: true,
              alias: ['hsts', 'languages-hsts'],
              inside: Prism.languages.hsts,
            },
            {
              pattern: headerValueOf(/[^:]+/.source),
              lookbehind: true,
            },
          ],
          'header-name': {
            pattern: /^[^:]+/,
            alias: 'keyword',
          },
          punctuation: /^:/,
        },
      },
    };

    // Create a mapping of Content-Type headers to language definitions
    var langs = Prism.languages;
    var httpLanguages = {
      'application/javascript': langs.javascript,
      'application/json': langs.json || langs.javascript,
      'application/xml': langs.xml,
      'text/xml': langs.xml,
      'text/html': langs.html,
      'text/css': langs.css,
      'text/plain': langs.plain,
    };

    // Declare which types can also be suffixes
    var suffixTypes = {
      'application/json': true,
      'application/xml': true,
    };

    /**
     * Returns a pattern for the given content type which matches it and any type which has it as a suffix.
     *
     * @param {string} contentType
     * @returns {string}
     */
    function getSuffixPattern(contentType) {
      var suffix = contentType.replace(/^[a-z]+\//, '');
      var suffixPattern = '\\w+/(?:[\\w.-]+\\+)+' + suffix + '(?![+\\w.-])';
      return '(?:' + contentType + '|' + suffixPattern + ')';
    }

    // Insert each content type parser that has its associated language
    // currently loaded.
    var options;
    for (var contentType in httpLanguages) {
      if (httpLanguages[contentType]) {
        options = options || {};

        var pattern = suffixTypes[contentType]
            ? getSuffixPattern(contentType)
            : contentType;
        options[contentType.replace(/\//g, '-')] = {
          pattern: RegExp(
              '(' +
              /content-type:\s*/.source +
              pattern +
              /(?:(?:\r\n?|\n)[\w-].*)*(?:\r(?:\n|(?!\n))|\n)/.source +
              ')' +
              // This is a little interesting:
              // The HTTP format spec required 1 empty line before the body to make everything unambiguous.
              // However, when writing code by hand (e.g. to display on a website) people can forget about this,
              // so we want to be liberal here. We will allow the empty line to be omitted if the first line of
              // the body does not start with a [\w-] character (as headers do).
              /[^ \t\w-][\s\S]*/.source,
              'i'
          ),
          lookbehind: true,
          inside: httpLanguages[contentType],
        };
      }
    }
    if (options) {
      Prism.languages.insertBefore('http', 'header', options);
    }
  })(Prism);

  /**
   * Original by Scott Helme.
   *
   * Reference: https://scotthelme.co.uk/hsts-cheat-sheet/
   */

  Prism.languages.hsts = {
    directive: {
      pattern: /\b(?:includeSubDomains|max-age|preload)(?=[\s;=]|$)/i,
      alias: 'property',
    },
    operator: /=/,
    punctuation: /;/,
  };

  (function (Prism) {
    Prism.languages.ignore = {
      // https://git-scm.com/docs/gitignore
      comment: /^#.*/m,
      entry: {
        pattern: /\S(?:.*(?:(?:\\ )|\S))?/,
        alias: 'string',
        inside: {
          operator: /^!|\*\*?|\?/,
          regex: {
            pattern: /(^|[^\\])\[[^\[\]]*\]/,
            lookbehind: true,
          },
          punctuation: /\//,
        },
      },
    };

    Prism.languages.gitignore = Prism.languages.ignore;
    Prism.languages.hgignore = Prism.languages.ignore;
    Prism.languages.npmignore = Prism.languages.ignore;
  })(Prism);

  Prism.languages.ini = {
    /**
     * The component mimics the behavior of the Win32 API parser.
     *
     * @see {@link https://github.com/PrismJS/prism/issues/2775#issuecomment-787477723}
     */

    comment: {
      pattern: /(^[ \f\t\v]*)[#;][^\n\r]*/m,
      lookbehind: true,
    },
    section: {
      pattern: /(^[ \f\t\v]*)\[[^\n\r\]]*\]?/m,
      lookbehind: true,
      inside: {
        'section-name': {
          pattern: /(^\[[ \f\t\v]*)[^ \f\t\v\]]+(?:[ \f\t\v]+[^ \f\t\v\]]+)*/,
          lookbehind: true,
          alias: 'selector',
        },
        punctuation: /\[|\]/,
      },
    },
    key: {
      pattern: /(^[ \f\t\v]*)[^ \f\n\r\t\v=]+(?:[ \f\t\v]+[^ \f\n\r\t\v=]+)*(?=[ \f\t\v]*=)/m,
      lookbehind: true,
      alias: 'attr-name',
    },
    value: {
      pattern: /(=[ \f\t\v]*)[^ \f\n\r\t\v]+(?:[ \f\t\v]+[^ \f\n\r\t\v]+)*/,
      lookbehind: true,
      alias: 'attr-value',
      inside: {
        'inner-value': {
          pattern: /^("|').+(?=\1$)/,
          lookbehind: true,
        },
      },
    },
    punctuation: /=/,
  };

  Prism.languages.io = {
    comment: {
      pattern: /(^|[^\\])(?:\/\*[\s\S]*?(?:\*\/|$)|\/\/.*|#.*)/,
      lookbehind: true,
      greedy: true,
    },
    'triple-quoted-string': {
      pattern: /"""(?:\\[\s\S]|(?!""")[^\\])*"""/,
      greedy: true,
      alias: 'string',
    },
    string: {
      pattern: /"(?:\\.|[^\\\r\n"])*"/,
      greedy: true,
    },
    keyword: /\b(?:activate|activeCoroCount|asString|block|break|call|catch|clone|collectGarbage|compileString|continue|do|doFile|doMessage|doString|else|elseif|exit|for|foreach|forward|getEnvironmentVariable|getSlot|hasSlot|if|ifFalse|ifNil|ifNilEval|ifTrue|isActive|isNil|isResumable|list|message|method|parent|pass|pause|perform|performWithArgList|print|println|proto|raise|raiseResumable|removeSlot|resend|resume|schedulerSleepSeconds|self|sender|setSchedulerSleepSeconds|setSlot|shallowCopy|slotNames|super|system|then|thisBlock|thisContext|try|type|uniqueId|updateSlot|wait|while|write|yield)\b/,
    builtin: /\b(?:Array|AudioDevice|AudioMixer|BigNum|Block|Box|Buffer|CFunction|CGI|Color|Curses|DBM|DNSResolver|DOConnection|DOProxy|DOServer|Date|Directory|Duration|DynLib|Error|Exception|FFT|File|Fnmatch|Font|Future|GL|GLE|GLScissor|GLU|GLUCylinder|GLUQuadric|GLUSphere|GLUT|Host|Image|Importer|LinkList|List|Lobby|Locals|MD5|MP3Decoder|MP3Encoder|Map|Message|Movie|Notification|Number|Object|OpenGL|Point|Protos|Random|Regex|SGML|SGMLElement|SGMLParser|SQLite|Sequence|Server|ShowMessage|SleepyCat|SleepyCatCursor|Socket|SocketManager|Sound|Soup|Store|String|Tree|UDPSender|UPDReceiver|URL|User|Warning|WeakLink)\b/,
    boolean: /\b(?:false|nil|true)\b/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e-?\d+)?/i,
    operator: /[=!*/%+\-^&|]=|>>?=?|<<?=?|:?:?=|\+\+?|--?|\*\*?|\/\/?|%|\|\|?|&&?|\b(?:and|not|or|return)\b|@@?|\?\??|\.\./,
    punctuation: /[{}[\];(),.:]/,
  };

  (function (Prism) {
    var keywords = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/;

    // full package (optional) + parent classes (optional)
    var classNamePrefix = /(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source;

    // based on the java naming conventions
    var className = {
      pattern: RegExp(
          /(^|[^\w.])/.source +
          classNamePrefix +
          /[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source
      ),
      lookbehind: true,
      inside: {
        namespace: {
          pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
          inside: {
            punctuation: /\./,
          },
        },
        punctuation: /\./,
      },
    };

    Prism.languages.java = Prism.languages.extend('clike', {
      string: {
        pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,
        lookbehind: true,
        greedy: true,
      },
      'class-name': [
        className,
        {
          // variables, parameters, and constructor references
          // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
          pattern: RegExp(
              /(^|[^\w.])/.source +
              classNamePrefix +
              /[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/
                  .source
          ),
          lookbehind: true,
          inside: className.inside,
        },
        {
          // class names based on keyword
          // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
          pattern: RegExp(
              /(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/
                  .source +
              classNamePrefix +
              /[A-Z]\w*\b/.source
          ),
          lookbehind: true,
          inside: className.inside,
        },
      ],
      keyword: keywords,
      function: [
        Prism.languages.clike.function,
        {
          pattern: /(::\s*)[a-z_]\w*/,
          lookbehind: true,
        },
      ],
      number: /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
      operator: {
        pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
        lookbehind: true,
      },
    });

    Prism.languages.insertBefore('java', 'string', {
      'triple-quoted-string': {
        // http://openjdk.java.net/jeps/355#Description
        pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
        greedy: true,
        alias: 'string',
      },
      char: {
        pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/,
        greedy: true,
      },
    });

    Prism.languages.insertBefore('java', 'class-name', {
      annotation: {
        pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
        lookbehind: true,
        alias: 'punctuation',
      },
      generics: {
        pattern: /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
        inside: {
          'class-name': className,
          keyword: keywords,
          punctuation: /[<>(),.:]/,
          operator: /[?&|]/,
        },
      },
      import: [
        {
          pattern: RegExp(
              /(\bimport\s+)/.source +
              classNamePrefix +
              /(?:[A-Z]\w*|\*)(?=\s*;)/.source
          ),
          lookbehind: true,
          inside: {
            namespace: className.inside.namespace,
            punctuation: /\./,
            operator: /\*/,
            'class-name': /\w+/,
          },
        },
        {
          pattern: RegExp(
              /(\bimport\s+static\s+)/.source +
              classNamePrefix +
              /(?:\w+|\*)(?=\s*;)/.source
          ),
          lookbehind: true,
          alias: 'static',
          inside: {
            namespace: className.inside.namespace,
            static: /\b\w+$/,
            punctuation: /\./,
            operator: /\*/,
            'class-name': /\w+/,
          },
        },
      ],
      namespace: {
        pattern: RegExp(
            /(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(
                /<keyword>/g,
                function () {
                  return keywords.source;
                }
            )
        ),
        lookbehind: true,
        inside: {
          punctuation: /\./,
        },
      },
    });
  })(Prism);

  (function (Prism) {
    var javaDocLike = (Prism.languages.javadoclike = {
      parameter: {
        pattern: /(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*@(?:arg|arguments|param)\s+)\w+/m,
        lookbehind: true,
      },
      keyword: {
        // keywords are the first word in a line preceded be an `@` or surrounded by curly braces.
        // @word, {@word}
        pattern: /(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,
        lookbehind: true,
      },
      punctuation: /[{}]/,
    });

    /**
     * Adds doc comment support to the given language and calls a given callback on each doc comment pattern.
     *
     * @param {string} lang the language add doc comment support to.
     * @param {(pattern: {inside: {rest: undefined}}) => void} callback the function called with each doc comment pattern as argument.
     */
    function docCommentSupport(lang, callback) {
      var tokenName = 'doc-comment';

      var grammar = Prism.languages[lang];
      if (!grammar) {
        return;
      }
      var token = grammar[tokenName];

      if (!token) {
        // add doc comment: /** */
        var definition = {};
        definition[tokenName] = {
          pattern: /(^|[^\\])\/\*\*[^/][\s\S]*?(?:\*\/|$)/,
          lookbehind: true,
          alias: 'comment',
        };

        grammar = Prism.languages.insertBefore(lang, 'comment', definition);
        token = grammar[tokenName];
      }

      if (token instanceof RegExp) {
        // convert regex to object
        token = grammar[tokenName] = {pattern: token};
      }

      if (Array.isArray(token)) {
        for (var i = 0, l = token.length; i < l; i++) {
          if (token[i] instanceof RegExp) {
            token[i] = {pattern: token[i]};
          }
          callback(token[i]);
        }
      } else {
        callback(token);
      }
    }

    /**
     * Adds doc-comment support to the given languages for the given documentation language.
     *
     * @param {string[]|string} languages
     * @param {Object} docLanguage
     */
    function addSupport(languages, docLanguage) {
      if (typeof languages === 'string') {
        languages = [languages];
      }

      languages.forEach(function (lang) {
        docCommentSupport(lang, function (pattern) {
          if (!pattern.inside) {
            pattern.inside = {};
          }
          pattern.inside.rest = docLanguage;
        });
      });
    }

    Object.defineProperty(javaDocLike, 'addSupport', {value: addSupport});

    javaDocLike.addSupport(['java', 'javascript', 'php'], javaDocLike);
  })(Prism);

  (function (Prism) {
    var codeLinePattern = /(^(?:[\t ]*(?:\*\s*)*))[^*\s].*$/m;

    var memberReference = /#\s*\w+(?:\s*\([^()]*\))?/.source;
    var reference = /(?:\b[a-zA-Z]\w+\s*\.\s*)*\b[A-Z]\w*(?:\s*<mem>)?|<mem>/.source.replace(
        /<mem>/g,
        function () {
          return memberReference;
        }
    );

    Prism.languages.javadoc = Prism.languages.extend('javadoclike', {});
    Prism.languages.insertBefore('javadoc', 'keyword', {
      reference: {
        pattern: RegExp(
            /(@(?:exception|link|linkplain|see|throws|value)\s+(?:\*\s*)?)/
                .source +
            '(?:' +
            reference +
            ')'
        ),
        lookbehind: true,
        inside: {
          function: {
            pattern: /(#\s*)\w+(?=\s*\()/,
            lookbehind: true,
          },
          field: {
            pattern: /(#\s*)\w+/,
            lookbehind: true,
          },
          namespace: {
            pattern: /\b(?:[a-z]\w*\s*\.\s*)+/,
            inside: {
              punctuation: /\./,
            },
          },
          'class-name': /\b[A-Z]\w*/,
          keyword: Prism.languages.java.keyword,
          punctuation: /[#()[\],.]/,
        },
      },
      'class-name': {
        // @param <T> the first generic type parameter
        pattern: /(@param\s+)<[A-Z]\w*>/,
        lookbehind: true,
        inside: {
          punctuation: /[.<>]/,
        },
      },
      'code-section': [
        {
          pattern: /(\{@code\s+(?!\s))(?:[^\s{}]|\s+(?![\s}])|\{(?:[^{}]|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*\})+(?=\s*\})/,
          lookbehind: true,
          inside: {
            code: {
              // there can't be any HTML inside of {@code} tags
              pattern: codeLinePattern,
              lookbehind: true,
              inside: Prism.languages.java,
              alias: 'language-java',
            },
          },
        },
        {
          pattern: /(<(code|pre|tt)>(?!<code>)\s*)\S(?:\S|\s+\S)*?(?=\s*<\/\2>)/,
          lookbehind: true,
          inside: {
            line: {
              pattern: codeLinePattern,
              lookbehind: true,
              inside: {
                // highlight HTML tags and entities
                tag: Prism.languages.markup.tag,
                entity: Prism.languages.markup.entity,
                code: {
                  // everything else is Java code
                  pattern: /.+/,
                  inside: Prism.languages.java,
                  alias: 'language-java',
                },
              },
            },
          },
        },
      ],
      tag: Prism.languages.markup.tag,
      entity: Prism.languages.markup.entity,
    });

    Prism.languages.javadoclike.addSupport('java', Prism.languages.javadoc);
  })(Prism);

  // Specification:
  // https://docs.oracle.com/en/java/javase/13/docs/api/java.base/java/lang/Throwable.html#printStackTrace()

  Prism.languages.javastacktrace = {
    // java.sql.SQLException: Violation of unique constraint MY_ENTITY_UK_1: duplicate value(s) for column(s) MY_COLUMN in statement [...]
    // Caused by: java.sql.SQLException: Violation of unique constraint MY_ENTITY_UK_1: duplicate value(s) for column(s) MY_COLUMN in statement [...]
    // Caused by: com.example.myproject.MyProjectServletException
    // Caused by: MidLevelException: LowLevelException
    // Suppressed: Resource$CloseFailException: Resource ID = 0
    summary: {
      pattern: /^([\t ]*)(?:(?:Caused by:|Suppressed:|Exception in thread "[^"]*")[\t ]+)?[\w$.]+(?::.*)?$/m,
      lookbehind: true,
      inside: {
        keyword: {
          pattern: /^([\t ]*)(?:(?:Caused by|Suppressed)(?=:)|Exception in thread)/m,
          lookbehind: true,
        },

        // the current thread if the summary starts with 'Exception in thread'
        string: {
          pattern: /^(\s*)"[^"]*"/,
          lookbehind: true,
        },
        exceptions: {
          pattern: /^(:?\s*)[\w$.]+(?=:|$)/,
          lookbehind: true,
          inside: {
            'class-name': /[\w$]+$/,
            namespace: /\b[a-z]\w*\b/,
            punctuation: /\./,
          },
        },
        message: {
          pattern: /(:\s*)\S.*/,
          lookbehind: true,
          alias: 'string',
        },
        punctuation: /:/,
      },
    },

    // at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1166)
    // at org.hsqldb.jdbc.Util.throwError(Unknown Source) here could be some notes
    // at java.base/java.lang.Class.forName0(Native Method)
    // at Util.<init>(Unknown Source)
    // at com.foo.loader/foo@9.0/com.foo.Main.run(Main.java:101)
    // at com.foo.loader//com.foo.bar.App.run(App.java:12)
    // at acme@2.1/org.acme.Lib.test(Lib.java:80)
    // at MyClass.mash(MyClass.java:9)
    //
    // More information:
    // https://docs.oracle.com/en/java/javase/13/docs/api/java.base/java/lang/StackTraceElement.html#toString()
    //
    // A valid Java module name is defined as:
    //   "A module name consists of one or more Java identifiers (§3.8) separated by "." tokens."
    // https://docs.oracle.com/javase/specs/jls/se9/html/jls-6.html#jls-ModuleName
    //
    // A Java module version is defined by this class:
    // https://docs.oracle.com/javase/9/docs/api/java/lang/module/ModuleDescriptor.Version.html
    // This is the implementation of the `parse` method in JDK13:
    // https://github.com/matcdac/jdk/blob/2305df71d1b7710266ae0956d73927a225132c0f/src/java.base/share/classes/java/lang/module/ModuleDescriptor.java#L1108
    // However, to keep this simple, a version will be matched by the pattern /@[\w$.+-]*/.
    'stack-frame': {
      pattern: /^([\t ]*)at (?:[\w$./]|@[\w$.+-]*\/)+(?:<init>)?\([^()]*\)/m,
      lookbehind: true,
      inside: {
        keyword: {
          pattern: /^(\s*)at(?= )/,
          lookbehind: true,
        },
        source: [
          // (Main.java:15)
          // (Main.scala:15)
          {
            pattern: /(\()\w+\.\w+:\d+(?=\))/,
            lookbehind: true,
            inside: {
              file: /^\w+\.\w+/,
              punctuation: /:/,
              'line-number': {
                pattern: /\b\d+\b/,
                alias: 'number',
              },
            },
          },
          // (Unknown Source)
          // (Native Method)
          // (...something...)
          {
            pattern: /(\()[^()]*(?=\))/,
            lookbehind: true,
            inside: {
              keyword: /^(?:Native Method|Unknown Source)$/,
            },
          },
        ],
        'class-name': /[\w$]+(?=\.(?:<init>|[\w$]+)\()/,
        function: /(?:<init>|[\w$]+)(?=\()/,
        'class-loader': {
          pattern: /(\s)[a-z]\w*(?:\.[a-z]\w*)*(?=\/[\w@$.]*\/)/,
          lookbehind: true,
          alias: 'namespace',
          inside: {
            punctuation: /\./,
          },
        },
        module: {
          pattern: /([\s/])[a-z]\w*(?:\.[a-z]\w*)*(?:@[\w$.+-]*)?(?=\/)/,
          lookbehind: true,
          inside: {
            version: {
              pattern: /(@)[\s\S]+/,
              lookbehind: true,
              alias: 'number',
            },
            punctuation: /[@.]/,
          },
        },
        namespace: {
          pattern: /(?:\b[a-z]\w*\.)+/,
          inside: {
            punctuation: /\./,
          },
        },
        punctuation: /[()/.]/,
      },
    },

    // ... 32 more
    // ... 32 common frames omitted
    more: {
      pattern: /^([\t ]*)\.{3} \d+ [a-z]+(?: [a-z]+)*/m,
      lookbehind: true,
      inside: {
        punctuation: /\.{3}/,
        number: /\d+/,
        keyword: /\b[a-z]+(?: [a-z]+)*\b/,
      },
    },
  };

  Prism.languages.jolie = Prism.languages.extend('clike', {
    string: {
      pattern: /(^|[^\\])"(?:\\[\s\S]|[^"\\])*"/,
      lookbehind: true,
      greedy: true,
    },
    'class-name': {
      pattern: /((?:\b(?:as|courier|embed|in|inputPort|outputPort|service)\b|@)[ \t]*)\w+/,
      lookbehind: true,
    },
    keyword: /\b(?:as|cH|comp|concurrent|constants|courier|cset|csets|default|define|else|embed|embedded|execution|exit|extender|for|foreach|forward|from|global|if|import|in|include|init|inputPort|install|instanceof|interface|is_defined|linkIn|linkOut|main|new|nullProcess|outputPort|over|private|provide|public|scope|sequential|service|single|spawn|synchronized|this|throw|throws|type|undef|until|while|with)\b/,
    function: /\b[a-z_]\w*(?=[ \t]*[@(])/i,
    number: /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?l?/i,
    operator: /-[-=>]?|\+[+=]?|<[<=]?|[>=*!]=?|&&|\|\||[?\/%^@|]/,
    punctuation: /[()[\]{},;.:]/,
    builtin: /\b(?:Byte|any|bool|char|double|enum|float|int|length|long|ranges|regex|string|undefined|void)\b/,
  });

  Prism.languages.insertBefore('jolie', 'keyword', {
    aggregates: {
      pattern: /(\bAggregates\s*:\s*)(?:\w+(?:\s+with\s+\w+)?\s*,\s*)*\w+(?:\s+with\s+\w+)?/,
      lookbehind: true,
      inside: {
        keyword: /\bwith\b/,
        'class-name': /\w+/,
        punctuation: /,/,
      },
    },
    redirects: {
      pattern: /(\bRedirects\s*:\s*)(?:\w+\s*=>\s*\w+\s*,\s*)*(?:\w+\s*=>\s*\w+)/,
      lookbehind: true,
      inside: {
        punctuation: /,/,
        'class-name': /\w+/,
        operator: /=>/,
      },
    },
    property: {
      pattern: /\b(?:Aggregates|[Ii]nterfaces|Java|Javascript|Jolie|[Ll]ocation|OneWay|[Pp]rotocol|Redirects|RequestResponse)\b(?=[ \t]*:)/,
    },
  });

  (function (Prism) {
    Prism.languages.typescript = Prism.languages.extend('javascript', {
      'class-name': {
        pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
        lookbehind: true,
        greedy: true,
        inside: null, // see below
      },
      builtin: /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/,
    });

    // The keywords TypeScript adds to JavaScript
    Prism.languages.typescript.keyword.push(
        /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
        // keywords that have to be followed by an identifier
        /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
        // This is for `import type *, {}`
        /\btype\b(?=\s*(?:[\{*]|$))/
    );

    // doesn't work with TS because TS is too complex
    delete Prism.languages.typescript['parameter'];
    delete Prism.languages.typescript['literal-property'];

    // a version of typescript specifically for highlighting types
    var typeInside = Prism.languages.extend('typescript', {});
    delete typeInside['class-name'];

    Prism.languages.typescript['class-name'].inside = typeInside;

    Prism.languages.insertBefore('typescript', 'function', {
      decorator: {
        pattern: /@[$\w\xA0-\uFFFF]+/,
        inside: {
          at: {
            pattern: /^@/,
            alias: 'operator',
          },
          function: /^[\s\S]+/,
        },
      },
      'generic-function': {
        // e.g. foo<T extends "bar" | "baz">( ...
        pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
        greedy: true,
        inside: {
          function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
          generic: {
            pattern: /<[\s\S]+/, // everything after the first <
            alias: 'class-name',
            inside: typeInside,
          },
        },
      },
    });

    Prism.languages.ts = Prism.languages.typescript;
  })(Prism);

  (function (Prism) {
    var javascript = Prism.languages.javascript;

    var type = /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/.source;
    var parameterPrefix =
        '(@(?:arg|argument|param|property)\\s+(?:' + type + '\\s+)?)';

    Prism.languages.jsdoc = Prism.languages.extend('javadoclike', {
      parameter: {
        // @param {string} foo - foo bar
        pattern: RegExp(
            parameterPrefix + /(?:(?!\s)[$\w\xA0-\uFFFF.])+(?=\s|$)/.source
        ),
        lookbehind: true,
        inside: {
          punctuation: /\./,
        },
      },
    });

    Prism.languages.insertBefore('jsdoc', 'keyword', {
      'optional-parameter': {
        // @param {string} [baz.foo="bar"] foo bar
        pattern: RegExp(
            parameterPrefix +
            /\[(?:(?!\s)[$\w\xA0-\uFFFF.])+(?:=[^[\]]+)?\](?=\s|$)/.source
        ),
        lookbehind: true,
        inside: {
          parameter: {
            pattern: /(^\[)[$\w\xA0-\uFFFF\.]+/,
            lookbehind: true,
            inside: {
              punctuation: /\./,
            },
          },
          code: {
            pattern: /(=)[\s\S]*(?=\]$)/,
            lookbehind: true,
            inside: javascript,
            alias: 'language-javascript',
          },
          punctuation: /[=[\]]/,
        },
      },
      'class-name': [
        {
          pattern: RegExp(
              /(@(?:augments|class|extends|interface|memberof!?|template|this|typedef)\s+(?:<TYPE>\s+)?)[A-Z]\w*(?:\.[A-Z]\w*)*/.source.replace(
                  /<TYPE>/g,
                  function () {
                    return type;
                  }
              )
          ),
          lookbehind: true,
          inside: {
            punctuation: /\./,
          },
        },
        {
          pattern: RegExp('(@[a-z]+\\s+)' + type),
          lookbehind: true,
          inside: {
            string: javascript.string,
            number: javascript.number,
            boolean: javascript.boolean,
            keyword: Prism.languages.typescript.keyword,
            operator: /=>|\.\.\.|[&|?:*]/,
            punctuation: /[.,;=<>{}()[\]]/,
          },
        },
      ],
      example: {
        pattern: /(@example\s+(?!\s))(?:[^@\s]|\s+(?!\s))+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,
        lookbehind: true,
        inside: {
          code: {
            pattern: /^([\t ]*(?:\*\s*)?)\S.*$/m,
            lookbehind: true,
            inside: javascript,
            alias: 'language-javascript',
          },
        },
      },
    });

    Prism.languages.javadoclike.addSupport('javascript', Prism.languages.jsdoc);
  })(Prism);

  (function (Prism) {
    Prism.languages.insertBefore('javascript', 'function-variable', {
      'method-variable': {
        pattern: RegExp(
            '(\\.\\s*)' +
            Prism.languages.javascript['function-variable'].pattern.source
        ),
        lookbehind: true,
        alias: ['function-variable', 'method', 'function', 'property-access'],
      },
    });

    Prism.languages.insertBefore('javascript', 'function', {
      method: {
        pattern: RegExp(
            '(\\.\\s*)' + Prism.languages.javascript['function'].source
        ),
        lookbehind: true,
        alias: ['function', 'property-access'],
      },
    });

    Prism.languages.insertBefore('javascript', 'constant', {
      'known-class-name': [
        {
          // standard built-ins
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
          pattern: /\b(?:(?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|(?:Weak)?(?:Map|Set)|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|WebAssembly)\b/,
          alias: 'class-name',
        },
        {
          // errors
          pattern: /\b(?:[A-Z]\w*)Error\b/,
          alias: 'class-name',
        },
      ],
    });

    /**
     * Replaces the `<ID>` placeholder in the given pattern with a pattern for general JS identifiers.
     *
     * @param {string} source
     * @param {string} [flags]
     * @returns {RegExp}
     */
    function withId(source, flags) {
      return RegExp(
          source.replace(/<ID>/g, function () {
            return /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/
                .source;
          }),
          flags
      );
    }

    Prism.languages.insertBefore('javascript', 'keyword', {
      imports: {
        // https://tc39.es/ecma262/#sec-imports
        pattern: withId(
            /(\bimport\b\s*)(?:<ID>(?:\s*,\s*(?:\*\s*as\s+<ID>|\{[^{}]*\}))?|\*\s*as\s+<ID>|\{[^{}]*\})(?=\s*\bfrom\b)/
                .source
        ),
        lookbehind: true,
        inside: Prism.languages.javascript,
      },
      exports: {
        // https://tc39.es/ecma262/#sec-exports
        pattern: withId(
            /(\bexport\b\s*)(?:\*(?:\s*as\s+<ID>)?(?=\s*\bfrom\b)|\{[^{}]*\})/
                .source
        ),
        lookbehind: true,
        inside: Prism.languages.javascript,
      },
    });

    Prism.languages.javascript['keyword'].unshift(
        {
          pattern: /\b(?:as|default|export|from|import)\b/,
          alias: 'module',
        },
        {
          pattern: /\b(?:await|break|catch|continue|do|else|finally|for|if|return|switch|throw|try|while|yield)\b/,
          alias: 'control-flow',
        },
        {
          pattern: /\bnull\b/,
          alias: ['null', 'nil'],
        },
        {
          pattern: /\bundefined\b/,
          alias: 'nil',
        }
    );

    Prism.languages.insertBefore('javascript', 'operator', {
      spread: {
        pattern: /\.{3}/,
        alias: 'operator',
      },
      arrow: {
        pattern: /=>/,
        alias: 'operator',
      },
    });

    Prism.languages.insertBefore('javascript', 'punctuation', {
      'property-access': {
        pattern: withId(/(\.\s*)#?<ID>/.source),
        lookbehind: true,
      },
      'maybe-class-name': {
        pattern: /(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/,
        lookbehind: true,
      },
      dom: {
        // this contains only a few commonly used DOM variables
        pattern: /\b(?:document|(?:local|session)Storage|location|navigator|performance|window)\b/,
        alias: 'variable',
      },
      console: {
        pattern: /\bconsole(?=\s*\.)/,
        alias: 'class-name',
      },
    });

    // add 'maybe-class-name' to tokens which might be a class name
    var maybeClassNameTokens = [
      'function',
      'function-variable',
      'method',
      'method-variable',
      'property-access',
    ];

    for (var i = 0; i < maybeClassNameTokens.length; i++) {
      var token = maybeClassNameTokens[i];
      var value = Prism.languages.javascript[token];

      // convert regex to object
      if (Prism.util.type(value) === 'RegExp') {
        value = Prism.languages.javascript[token] = {
          pattern: value,
        };
      }

      // keep in mind that we don't support arrays

      var inside = value.inside || {};
      value.inside = inside;

      inside['maybe-class-name'] = /^[A-Z][\s\S]*/;
    }
  })(Prism);

  // https://www.json.org/json-en.html
  Prism.languages.json = {
    property: {
      pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
      lookbehind: true,
      greedy: true,
    },
    string: {
      pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
      lookbehind: true,
      greedy: true,
    },
    comment: {
      pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
      greedy: true,
    },
    number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    boolean: /\b(?:false|true)\b/,
    null: {
      pattern: /\bnull\b/,
      alias: 'keyword',
    },
  };

  Prism.languages.webmanifest = Prism.languages.json;

  (function (Prism) {
    var string = /("|')(?:\\(?:\r\n?|\n|.)|(?!\1)[^\\\r\n])*\1/;

    Prism.languages.json5 = Prism.languages.extend('json', {
      property: [
        {
          pattern: RegExp(string.source + '(?=\\s*:)'),
          greedy: true,
        },
        {
          pattern: /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/,
          alias: 'unquoted',
        },
      ],
      string: {
        pattern: string,
        greedy: true,
      },
      number: /[+-]?\b(?:NaN|Infinity|0x[a-fA-F\d]+)\b|[+-]?(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+\b)?/,
    });
  })(Prism);

  Prism.languages.jsonp = Prism.languages.extend('json', {
    punctuation: /[{}[\]();,.]/,
  });

  Prism.languages.insertBefore('jsonp', 'punctuation', {
    function: /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*\()/,
  });

  Prism.languages.jsstacktrace = {
    'error-message': {
      pattern: /^\S.*/m,
      alias: 'string',
    },

    'stack-frame': {
      pattern: /(^[ \t]+)at[ \t].*/m,
      lookbehind: true,
      inside: {
        'not-my-code': {
          pattern: /^at[ \t]+(?!\s)(?:node\.js|<unknown>|.*(?:node_modules|\(<anonymous>\)|\(<unknown>|<anonymous>$|\(internal\/|\(node\.js)).*/m,
          alias: 'comment',
        },

        filename: {
          pattern: /(\bat\s+(?!\s)|\()(?:[a-zA-Z]:)?[^():]+(?=:)/,
          lookbehind: true,
          alias: 'url',
        },

        function: {
          pattern: /(\bat\s+(?:new\s+)?)(?!\s)[_$a-zA-Z\xA0-\uFFFF<][.$\w\xA0-\uFFFF<>]*/,
          lookbehind: true,
          inside: {
            punctuation: /\./,
          },
        },

        punctuation: /[()]/,

        keyword: /\b(?:at|new)\b/,

        alias: {
          pattern: /\[(?:as\s+)?(?!\s)[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\]/,
          alias: 'variable',
        },

        'line-number': {
          pattern: /:\d+(?::\d+)?\b/,
          alias: 'number',
          inside: {
            punctuation: /:/,
          },
        },
      },
    },
  };

  (function (Prism) {
    var templateString = Prism.languages.javascript['template-string'];

    // see the pattern in prism-javascript.js
    var templateLiteralPattern = templateString.pattern.source;
    var interpolationObject = templateString.inside['interpolation'];
    var interpolationPunctuationObject =
        interpolationObject.inside['interpolation-punctuation'];
    var interpolationPattern = interpolationObject.pattern.source;

    /**
     * Creates a new pattern to match a template string with a special tag.
     *
     * This will return `undefined` if there is no grammar with the given language id.
     *
     * @param {string} language The language id of the embedded language. E.g. `markdown`.
     * @param {string} tag The regex pattern to match the tag.
     * @returns {object | undefined}
     * @example
     * createTemplate('css', /\bcss/.source);
     */
    function createTemplate(language, tag) {
      if (!Prism.languages[language]) {
        return undefined;
      }

      return {
        pattern: RegExp('((?:' + tag + ')\\s*)' + templateLiteralPattern),
        lookbehind: true,
        greedy: true,
        inside: {
          'template-punctuation': {
            pattern: /^`|`$/,
            alias: 'string',
          },
          'embedded-code': {
            pattern: /[\s\S]+/,
            alias: language,
          },
        },
      };
    }

    Prism.languages.javascript['template-string'] = [
      // styled-jsx:
      //   css`a { color: #25F; }`
      // styled-components:
      //   styled.h1`color: red;`
      createTemplate(
          'css',
          /\b(?:styled(?:\([^)]*\))?(?:\s*\.\s*\w+(?:\([^)]*\))*)*|css(?:\s*\.\s*(?:global|resolve))?|createGlobalStyle|keyframes)/
              .source
      ),

      // html`<p></p>`
      // div.innerHTML = `<p></p>`
      createTemplate('html', /\bhtml|\.\s*(?:inner|outer)HTML\s*\+?=/.source),

      // svg`<path fill="#fff" d="M55.37 ..."/>`
      createTemplate('svg', /\bsvg/.source),

      // md`# h1`, markdown`## h2`
      createTemplate('markdown', /\b(?:markdown|md)/.source),

      // gql`...`, graphql`...`, graphql.experimental`...`
      createTemplate(
          'graphql',
          /\b(?:gql|graphql(?:\s*\.\s*experimental)?)/.source
      ),

      // sql`...`
      createTemplate('sql', /\bsql/.source),

      // vanilla template string
      templateString,
    ].filter(Boolean);

    /**
     * Returns a specific placeholder literal for the given language.
     *
     * @param {number} counter
     * @param {string} language
     * @returns {string}
     */
    function getPlaceholder(counter, language) {
      return '___' + language.toUpperCase() + '_' + counter + '___';
    }

    /**
     * Returns the tokens of `Prism.tokenize` but also runs the `before-tokenize` and `after-tokenize` hooks.
     *
     * @param {string} code
     * @param {any} grammar
     * @param {string} language
     * @returns {(string|Token)[]}
     */
    function tokenizeWithHooks(code, grammar, language) {
      var env = {
        code: code,
        grammar: grammar,
        language: language,
      };
      Prism.hooks.run('before-tokenize', env);
      env.tokens = Prism.tokenize(env.code, env.grammar);
      Prism.hooks.run('after-tokenize', env);
      return env.tokens;
    }

    /**
     * Returns the token of the given JavaScript interpolation expression.
     *
     * @param {string} expression The code of the expression. E.g. `"${42}"`
     * @returns {Token}
     */
    function tokenizeInterpolationExpression(expression) {
      var tempGrammar = {};
      tempGrammar['interpolation-punctuation'] = interpolationPunctuationObject;

      /** @type {Array} */
      var tokens = Prism.tokenize(expression, tempGrammar);
      if (tokens.length === 3) {
        /**
         * The token array will look like this
         * [
         *     ["interpolation-punctuation", "${"]
         *     "..." // JavaScript expression of the interpolation
         *     ["interpolation-punctuation", "}"]
         * ]
         */

        var args = [1, 1];
        args.push.apply(
            args,
            tokenizeWithHooks(tokens[1], Prism.languages.javascript, 'javascript')
        );

        tokens.splice.apply(tokens, args);
      }

      return new Prism.Token(
          'interpolation',
          tokens,
          interpolationObject.alias,
          expression
      );
    }

    /**
     * Tokenizes the given code with support for JavaScript interpolation expressions mixed in.
     *
     * This function has 3 phases:
     *
     * 1. Replace all JavaScript interpolation expression with a placeholder.
     *    The placeholder will have the syntax of a identify of the target language.
     * 2. Tokenize the code with placeholders.
     * 3. Tokenize the interpolation expressions and re-insert them into the tokenize code.
     *    The insertion only works if a placeholder hasn't been "ripped apart" meaning that the placeholder has been
     *    tokenized as two tokens by the grammar of the embedded language.
     *
     * @param {string} code
     * @param {object} grammar
     * @param {string} language
     * @returns {Token}
     */
    function tokenizeEmbedded(code, grammar, language) {
      // 1. First filter out all interpolations

      // because they might be escaped, we need a lookbehind, so we use Prism
      /** @type {(Token|string)[]} */
      var _tokens = Prism.tokenize(code, {
        interpolation: {
          pattern: RegExp(interpolationPattern),
          lookbehind: true,
        },
      });

      // replace all interpolations with a placeholder which is not in the code already
      var placeholderCounter = 0;
      /** @type {Object<string, string>} */
      var placeholderMap = {};
      var embeddedCode = _tokens
          .map(function (token) {
            if (typeof token === 'string') {
              return token;
            } else {
              var interpolationExpression = token.content;

              var placeholder;
              while (
                  code.indexOf(
                      (placeholder = getPlaceholder(placeholderCounter++, language))
                  ) !== -1
                  ) {
                /* noop */
              }
              placeholderMap[placeholder] = interpolationExpression;
              return placeholder;
            }
          })
          .join('');

      // 2. Tokenize the embedded code

      var embeddedTokens = tokenizeWithHooks(embeddedCode, grammar, language);

      // 3. Re-insert the interpolation

      var placeholders = Object.keys(placeholderMap);
      placeholderCounter = 0;

      /**
       *
       * @param {(Token|string)[]} tokens
       * @returns {void}
       */
      function walkTokens(tokens) {
        for (var i = 0; i < tokens.length; i++) {
          if (placeholderCounter >= placeholders.length) {
            return;
          }

          var token = tokens[i];

          if (typeof token === 'string' || typeof token.content === 'string') {
            var placeholder = placeholders[placeholderCounter];
            var s =
                typeof token === 'string'
                    ? token
                    : /** @type {string} */ (token.content);

            var index = s.indexOf(placeholder);
            if (index !== -1) {
              ++placeholderCounter;

              var before = s.substring(0, index);
              var middle = tokenizeInterpolationExpression(
                  placeholderMap[placeholder]
              );
              var after = s.substring(index + placeholder.length);

              var replacement = [];
              if (before) {
                replacement.push(before);
              }
              replacement.push(middle);
              if (after) {
                var afterTokens = [after];
                walkTokens(afterTokens);
                replacement.push.apply(replacement, afterTokens);
              }

              if (typeof token === 'string') {
                tokens.splice.apply(tokens, [i, 1].concat(replacement));
                i += replacement.length - 1;
              } else {
                token.content = replacement;
              }
            }
          } else {
            var content = token.content;
            if (Array.isArray(content)) {
              walkTokens(content);
            } else {
              walkTokens([content]);
            }
          }
        }
      }

      walkTokens(embeddedTokens);

      return new Prism.Token(
          language,
          embeddedTokens,
          'language-' + language,
          code
      );
    }

    /**
     * The languages for which JS templating will handle tagged template literals.
     *
     * JS templating isn't active for only JavaScript but also related languages like TypeScript, JSX, and TSX.
     */
    var supportedLanguages = {
      javascript: true,
      js: true,
      typescript: true,
      ts: true,
      jsx: true,
      tsx: true,
    };
    Prism.hooks.add('after-tokenize', function (env) {
      if (!(env.language in supportedLanguages)) {
        return;
      }

      /**
       * Finds and tokenizes all template strings with an embedded languages.
       *
       * @param {(Token | string)[]} tokens
       * @returns {void}
       */
      function findTemplateStrings(tokens) {
        for (var i = 0, l = tokens.length; i < l; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            continue;
          }

          var content = token.content;
          if (!Array.isArray(content)) {
            if (typeof content !== 'string') {
              findTemplateStrings([content]);
            }
            continue;
          }

          if (token.type === 'template-string') {
            /**
             * A JavaScript template-string token will look like this:
             *
             * ["template-string", [
             *     ["template-punctuation", "`"],
             *     (
             *         An array of "string" and "interpolation" tokens. This is the simple string case.
             *         or
             *         ["embedded-code", "..."] This is the token containing the embedded code.
             *                                  It also has an alias which is the language of the embedded code.
             *     ),
             *     ["template-punctuation", "`"]
             * ]]
             */

            var embedded = content[1];
            if (
                content.length === 3 &&
                typeof embedded !== 'string' &&
                embedded.type === 'embedded-code'
            ) {
              // get string content
              var code = stringContent(embedded);

              var alias = embedded.alias;
              var language = Array.isArray(alias) ? alias[0] : alias;

              var grammar = Prism.languages[language];
              if (!grammar) {
                // the embedded language isn't registered.
                continue;
              }

              content[1] = tokenizeEmbedded(code, grammar, language);
            }
          } else {
            findTemplateStrings(content);
          }
        }
      }

      findTemplateStrings(env.tokens);
    });

    /**
     * Returns the string content of a token or token stream.
     *
     * @param {string | Token | (string | Token)[]} value
     * @returns {string}
     */
    function stringContent(value) {
      if (typeof value === 'string') {
        return value;
      } else if (Array.isArray(value)) {
        return value.map(stringContent).join('');
      } else {
        return stringContent(value.content);
      }
    }
  })(Prism);

  (function (Prism) {
    Prism.languages.kotlin = Prism.languages.extend('clike', {
      keyword: {
        // The lookbehind prevents wrong highlighting of e.g. kotlin.properties.get
        pattern: /(^|[^.])\b(?:abstract|actual|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|dynamic|else|enum|expect|external|final|finally|for|fun|get|if|import|in|infix|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|to|try|typealias|val|var|vararg|when|where|while)\b/,
        lookbehind: true,
      },
      function: [
        {
          pattern: /(?:`[^\r\n`]+`|\b\w+)(?=\s*\()/,
          greedy: true,
        },
        {
          pattern: /(\.)(?:`[^\r\n`]+`|\w+)(?=\s*\{)/,
          lookbehind: true,
          greedy: true,
        },
      ],
      number: /\b(?:0[xX][\da-fA-F]+(?:_[\da-fA-F]+)*|0[bB][01]+(?:_[01]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?[fFL]?)\b/,
      operator: /\+[+=]?|-[-=>]?|==?=?|!(?:!|==?)?|[\/*%<>]=?|[?:]:?|\.\.|&&|\|\||\b(?:and|inv|or|shl|shr|ushr|xor)\b/,
    });

    delete Prism.languages.kotlin['class-name'];

    var interpolationInside = {
      'interpolation-punctuation': {
        pattern: /^\$\{?|\}$/,
        alias: 'punctuation',
      },
      expression: {
        pattern: /[\s\S]+/,
        inside: Prism.languages.kotlin,
      },
    };

    Prism.languages.insertBefore('kotlin', 'string', {
      // https://kotlinlang.org/spec/expressions.html#string-interpolation-expressions
      'string-literal': [
        {
          pattern: /"""(?:[^$]|\$(?:(?!\{)|\{[^{}]*\}))*?"""/,
          alias: 'multiline',
          inside: {
            interpolation: {
              pattern: /\$(?:[a-z_]\w*|\{[^{}]*\})/i,
              inside: interpolationInside,
            },
            string: /[\s\S]+/,
          },
        },
        {
          pattern: /"(?:[^"\\\r\n$]|\\.|\$(?:(?!\{)|\{[^{}]*\}))*"/,
          alias: 'singleline',
          inside: {
            interpolation: {
              pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:[a-z_]\w*|\{[^{}]*\})/i,
              lookbehind: true,
              inside: interpolationInside,
            },
            string: /[\s\S]+/,
          },
        },
      ],
      char: {
        // https://kotlinlang.org/spec/expressions.html#character-literals
        pattern: /'(?:[^'\\\r\n]|\\(?:.|u[a-fA-F0-9]{0,4}))'/,
        greedy: true,
      },
    });

    delete Prism.languages.kotlin['string'];

    Prism.languages.insertBefore('kotlin', 'keyword', {
      annotation: {
        pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/,
        alias: 'builtin',
      },
    });

    Prism.languages.insertBefore('kotlin', 'function', {
      label: {
        pattern: /\b\w+@|@\w+\b/,
        alias: 'symbol',
      },
    });

    Prism.languages.kt = Prism.languages.kotlin;
    Prism.languages.kts = Prism.languages.kotlin;
  })(Prism);

  /* FIXME :
 :extend() is not handled specifically : its highlighting is buggy.
 Mixin usage must be inside a ruleset to be highlighted.
 At-rules (e.g. import) containing interpolations are buggy.
 Detached rulesets are highlighted as at-rules.
 A comment before a mixin usage prevents the latter to be properly highlighted.
 */

  Prism.languages.less = Prism.languages.extend('css', {
    comment: [
      /\/\*[\s\S]*?\*\//,
      {
        pattern: /(^|[^\\])\/\/.*/,
        lookbehind: true,
      },
    ],
    atrule: {
      pattern: /@[\w-](?:\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};\s]|\s+(?!\s))*?(?=\s*\{)/,
      inside: {
        punctuation: /[:()]/,
      },
    },
    // selectors and mixins are considered the same
    selector: {
      pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};@\s]|\s+(?!\s))*?(?=\s*\{)/,
      inside: {
        // mixin parameters
        variable: /@+[\w-]+/,
      },
    },

    property: /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/,
    operator: /[+\-*\/]/,
  });

  Prism.languages.insertBefore('less', 'property', {
    variable: [
      // Variable declaration (the colon must be consumed!)
      {
        pattern: /@[\w-]+\s*:/,
        inside: {
          punctuation: /:/,
        },
      },

      // Variable usage
      /@@?[\w-]+/,
    ],
    'mixin-usage': {
      pattern: /([{;]\s*)[.#](?!\d)[\w-].*?(?=[(;])/,
      lookbehind: true,
      alias: 'function',
    },
  });

  Prism.languages.makefile = {
    comment: {
      pattern: /(^|[^\\])#(?:\\(?:\r\n|[\s\S])|[^\\\r\n])*/,
      lookbehind: true,
    },
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true,
    },

    'builtin-target': {
      pattern: /\.[A-Z][^:#=\s]+(?=\s*:(?!=))/,
      alias: 'builtin',
    },

    target: {
      pattern: /^(?:[^:=\s]|[ \t]+(?![\s:]))+(?=\s*:(?!=))/m,
      alias: 'symbol',
      inside: {
        variable: /\$+(?:(?!\$)[^(){}:#=\s]+|(?=[({]))/,
      },
    },
    variable: /\$+(?:(?!\$)[^(){}:#=\s]+|\([@*%<^+?][DF]\)|(?=[({]))/,

    // Directives
    keyword: /-include\b|\b(?:define|else|endef|endif|export|ifn?def|ifn?eq|include|override|private|sinclude|undefine|unexport|vpath)\b/,

    function: {
      pattern: /(\()(?:abspath|addsuffix|and|basename|call|dir|error|eval|file|filter(?:-out)?|findstring|firstword|flavor|foreach|guile|if|info|join|lastword|load|notdir|or|origin|patsubst|realpath|shell|sort|strip|subst|suffix|value|warning|wildcard|word(?:list|s)?)(?=[ \t])/,
      lookbehind: true,
    },
    operator: /(?:::|[?:+!])?=|[|@]/,
    punctuation: /[:;(){}]/,
  };

  (function (Prism) {
    // Allow only one line break
    var inner = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source;

    /**
     * This function is intended for the creation of the bold or italic pattern.
     *
     * This also adds a lookbehind group to the given pattern to ensure that the pattern is not backslash-escaped.
     *
     * _Note:_ Keep in mind that this adds a capturing group.
     *
     * @param {string} pattern
     * @returns {RegExp}
     */
    function createInline(pattern) {
      pattern = pattern.replace(/<inner>/g, function () {
        return inner;
      });
      return RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + '(?:' + pattern + ')');
    }

    var tableCell = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/
        .source;
    var tableRow = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(
        /__/g,
        function () {
          return tableCell;
        }
    );
    var tableLine = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/
        .source;

    Prism.languages.markdown = Prism.languages.extend('markup', {});
    Prism.languages.insertBefore('markdown', 'prolog', {
      'front-matter-block': {
        pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
        lookbehind: true,
        greedy: true,
        inside: {
          punctuation: /^---|---$/,
          'front-matter': {
            pattern: /\S+(?:\s+\S+)*/,
            alias: ['yaml', 'language-yaml'],
            inside: Prism.languages.yaml,
          },
        },
      },
      blockquote: {
        // > ...
        pattern: /^>(?:[\t ]*>)*/m,
        alias: 'punctuation',
      },
      table: {
        pattern: RegExp(
            '^' + tableRow + tableLine + '(?:' + tableRow + ')*',
            'm'
        ),
        inside: {
          'table-data-rows': {
            pattern: RegExp(
                '^(' + tableRow + tableLine + ')(?:' + tableRow + ')*$'
            ),
            lookbehind: true,
            inside: {
              'table-data': {
                pattern: RegExp(tableCell),
                inside: Prism.languages.markdown,
              },
              punctuation: /\|/,
            },
          },
          'table-line': {
            pattern: RegExp('^(' + tableRow + ')' + tableLine + '$'),
            lookbehind: true,
            inside: {
              punctuation: /\||:?-{3,}:?/,
            },
          },
          'table-header-row': {
            pattern: RegExp('^' + tableRow + '$'),
            inside: {
              'table-header': {
                pattern: RegExp(tableCell),
                alias: 'important',
                inside: Prism.languages.markdown,
              },
              punctuation: /\|/,
            },
          },
        },
      },
      code: [
        {
          // Prefixed by 4 spaces or 1 tab and preceded by an empty line
          pattern: /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
          lookbehind: true,
          alias: 'keyword',
        },
        {
          // ```optional language
          // code block
          // ```
          pattern: /^```[\s\S]*?^```$/m,
          greedy: true,
          inside: {
            'code-block': {
              pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
              lookbehind: true,
            },
            'code-language': {
              pattern: /^(```).+/,
              lookbehind: true,
            },
            punctuation: /```/,
          },
        },
      ],
      title: [
        {
          // title 1
          // =======

          // title 2
          // -------
          pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
          alias: 'important',
          inside: {
            punctuation: /==+$|--+$/,
          },
        },
        {
          // # title 1
          // ###### title 6
          pattern: /(^\s*)#.+/m,
          lookbehind: true,
          alias: 'important',
          inside: {
            punctuation: /^#+|#+$/,
          },
        },
      ],
      hr: {
        // ***
        // ---
        // * * *
        // -----------
        pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
        lookbehind: true,
        alias: 'punctuation',
      },
      list: {
        // * item
        // + item
        // - item
        // 1. item
        pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
        lookbehind: true,
        alias: 'punctuation',
      },
      'url-reference': {
        // [id]: http://example.com "Optional title"
        // [id]: http://example.com 'Optional title'
        // [id]: http://example.com (Optional title)
        // [id]: <http://example.com> "Optional title"
        pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
        inside: {
          variable: {
            pattern: /^(!?\[)[^\]]+/,
            lookbehind: true,
          },
          string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
          punctuation: /^[\[\]!:]|[<>]/,
        },
        alias: 'url',
      },
      bold: {
        // **strong**
        // __strong__

        // allow one nested instance of italic text using the same delimiter
        pattern: createInline(
            /\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/
                .source
        ),
        lookbehind: true,
        greedy: true,
        inside: {
          content: {
            pattern: /(^..)[\s\S]+(?=..$)/,
            lookbehind: true,
            inside: {}, // see below
          },
          punctuation: /\*\*|__/,
        },
      },
      italic: {
        // *em*
        // _em_

        // allow one nested instance of bold text using the same delimiter
        pattern: createInline(
            /\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/
                .source
        ),
        lookbehind: true,
        greedy: true,
        inside: {
          content: {
            pattern: /(^.)[\s\S]+(?=.$)/,
            lookbehind: true,
            inside: {}, // see below
          },
          punctuation: /[*_]/,
        },
      },
      strike: {
        // ~~strike through~~
        // ~strike~
        // eslint-disable-next-line regexp/strict
        pattern: createInline(/(~~?)(?:(?!~)<inner>)+\2/.source),
        lookbehind: true,
        greedy: true,
        inside: {
          content: {
            pattern: /(^~~?)[\s\S]+(?=\1$)/,
            lookbehind: true,
            inside: {}, // see below
          },
          punctuation: /~~?/,
        },
      },
      'code-snippet': {
        // `code`
        // ``code``
        pattern: /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
        lookbehind: true,
        greedy: true,
        alias: ['code', 'keyword'],
      },
      url: {
        // [example](http://example.com "Optional title")
        // [example][id]
        // [example] [id]
        pattern: createInline(
            /!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/
                .source
        ),
        lookbehind: true,
        greedy: true,
        inside: {
          operator: /^!/,
          content: {
            pattern: /(^\[)[^\]]+(?=\])/,
            lookbehind: true,
            inside: {}, // see below
          },
          variable: {
            pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/,
            lookbehind: true,
          },
          url: {
            pattern: /(^\]\()[^\s)]+/,
            lookbehind: true,
          },
          string: {
            pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
            lookbehind: true,
          },
        },
      },
    });

    ['url', 'bold', 'italic', 'strike'].forEach(function (token) {
      ['url', 'bold', 'italic', 'strike', 'code-snippet'].forEach(function (
          inside
      ) {
        if (token !== inside) {
          Prism.languages.markdown[token].inside.content.inside[inside] =
              Prism.languages.markdown[inside];
        }
      });
    });

    Prism.hooks.add('after-tokenize', function (env) {
      if (env.language !== 'markdown' && env.language !== 'md') {
        return;
      }

      function walkTokens(tokens) {
        if (!tokens || typeof tokens === 'string') {
          return;
        }

        for (var i = 0, l = tokens.length; i < l; i++) {
          var token = tokens[i];

          if (token.type !== 'code') {
            walkTokens(token.content);
            continue;
          }

          /*
           * Add the correct `language-xxxx` class to this code block. Keep in mind that the `code-language` token
           * is optional. But the grammar is defined so that there is only one case we have to handle:
           *
           * token.content = [
           *     <span class="punctuation">```</span>,
           *     <span class="code-language">xxxx</span>,
           *     '\n', // exactly one new lines (\r or \n or \r\n)
           *     <span class="code-block">...</span>,
           *     '\n', // exactly one new lines again
           *     <span class="punctuation">```</span>
           * ];
           */

          var codeLang = token.content[1];
          var codeBlock = token.content[3];

          if (
              codeLang &&
              codeBlock &&
              codeLang.type === 'code-language' &&
              codeBlock.type === 'code-block' &&
              typeof codeLang.content === 'string'
          ) {
            // this might be a language that Prism does not support

            // do some replacements to support C++, C#, and F#
            var lang = codeLang.content
                .replace(/\b#/g, 'sharp')
                .replace(/\b\+\+/g, 'pp');
            // only use the first word
            lang = (/[a-z][\w-]*/i.exec(lang) || [''])[0].toLowerCase();
            var alias = 'language-' + lang;

            // add alias
            if (!codeBlock.alias) {
              codeBlock.alias = [alias];
            } else if (typeof codeBlock.alias === 'string') {
              codeBlock.alias = [codeBlock.alias, alias];
            } else {
              codeBlock.alias.push(alias);
            }
          }
        }
      }

      walkTokens(env.tokens);
    });

    Prism.hooks.add('wrap', function (env) {
      if (env.type !== 'code-block') {
        return;
      }

      var codeLang = '';
      for (var i = 0, l = env.classes.length; i < l; i++) {
        var cls = env.classes[i];
        var match = /language-(.+)/.exec(cls);
        if (match) {
          codeLang = match[1];
          break;
        }
      }

      var grammar = Prism.languages[codeLang];

      if (!grammar) {
        if (codeLang && codeLang !== 'none' && Prism.plugins.autoloader) {
          var id =
              'md-' +
              new Date().valueOf() +
              '-' +
              Math.floor(Math.random() * 1e16);
          env.attributes['id'] = id;

          Prism.plugins.autoloader.loadLanguages(codeLang, function () {
            var ele = document.getElementById(id);
            if (ele) {
              ele.innerHTML = Prism.highlight(
                  ele.textContent,
                  Prism.languages[codeLang],
                  codeLang
              );
            }
          });
        }
      } else {
        env.content = Prism.highlight(
            textContent(env.content),
            grammar,
            codeLang
        );
      }
    });

    var tagPattern = RegExp(Prism.languages.markup.tag.pattern.source, 'gi');

    /**
     * A list of known entity names.
     *
     * This will always be incomplete to save space. The current list is the one used by lowdash's unescape function.
     *
     * @see {@link https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/unescape.js#L2}
     */
    var KNOWN_ENTITY_NAMES = {
      amp: '&',
      lt: '<',
      gt: '>',
      quot: '"',
    };

    // IE 11 doesn't support `String.fromCodePoint`
    var fromCodePoint = String.fromCodePoint || String.fromCharCode;

    /**
     * Returns the text content of a given HTML source code string.
     *
     * @param {string} html
     * @returns {string}
     */
    function textContent(html) {
      // remove all tags
      var text = html.replace(tagPattern, '');

      // decode known entities
      text = text.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, function (m, code) {
        code = code.toLowerCase();

        if (code[0] === '#') {
          var value;
          if (code[1] === 'x') {
            value = parseInt(code.slice(2), 16);
          } else {
            value = Number(code.slice(1));
          }

          return fromCodePoint(value);
        } else {
          var known = KNOWN_ENTITY_NAMES[code];
          if (known) {
            return known;
          }

          // unable to decode
          return m;
        }
      });

      return text;
    }

    Prism.languages.md = Prism.languages.markdown;
  })(Prism);

  (function (Prism) {
    var variable = /\$(?:\w[a-z\d]*(?:_[^\x00-\x1F\s"'\\()$]*)?|\{[^}\s"'\\]+\})/i;

    Prism.languages.nginx = {
      comment: {
        pattern: /(^|[\s{};])#.*/,
        lookbehind: true,
        greedy: true,
      },
      directive: {
        pattern: /(^|\s)\w(?:[^;{}"'\\\s]|\\.|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\s+(?:#.*(?!.)|(?![#\s])))*?(?=\s*[;{])/,
        lookbehind: true,
        greedy: true,
        inside: {
          string: {
            pattern: /((?:^|[^\\])(?:\\\\)*)(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/,
            lookbehind: true,
            greedy: true,
            inside: {
              escape: {
                pattern: /\\["'\\nrt]/,
                alias: 'entity',
              },
              variable: variable,
            },
          },
          comment: {
            pattern: /(\s)#.*/,
            lookbehind: true,
            greedy: true,
          },
          keyword: {
            pattern: /^\S+/,
            greedy: true,
          },

          // other patterns

          boolean: {
            pattern: /(\s)(?:off|on)(?!\S)/,
            lookbehind: true,
          },
          number: {
            pattern: /(\s)\d+[a-z]*(?!\S)/i,
            lookbehind: true,
          },
          variable: variable,
        },
      },
      punctuation: /[{};]/,
    };
  })(Prism);

  (function (Prism) {
    var powershell = (Prism.languages.powershell = {
      comment: [
        {
          pattern: /(^|[^`])<#[\s\S]*?#>/,
          lookbehind: true,
        },
        {
          pattern: /(^|[^`])#.*/,
          lookbehind: true,
        },
      ],
      string: [
        {
          pattern: /"(?:`[\s\S]|[^`"])*"/,
          greedy: true,
          inside: null, // see below
        },
        {
          pattern: /'(?:[^']|'')*'/,
          greedy: true,
        },
      ],
      // Matches name spaces as well as casts, attribute decorators. Force starting with letter to avoid matching array indices
      // Supports two levels of nested brackets (e.g. `[OutputType([System.Collections.Generic.List[int]])]`)
      namespace: /\[[a-z](?:\[(?:\[[^\]]*\]|[^\[\]])*\]|[^\[\]])*\]/i,
      boolean: /\$(?:false|true)\b/i,
      variable: /\$\w+\b/,
      // Cmdlets and aliases. Aliases should come last, otherwise "write" gets preferred over "write-host" for example
      // Get-Command | ?{ $_.ModuleName -match "Microsoft.PowerShell.(Util|Core|Management)" }
      // Get-Alias | ?{ $_.ReferencedCommand.Module.Name -match "Microsoft.PowerShell.(Util|Core|Management)" }
      function: [
        /\b(?:Add|Approve|Assert|Backup|Block|Checkpoint|Clear|Close|Compare|Complete|Compress|Confirm|Connect|Convert|ConvertFrom|ConvertTo|Copy|Debug|Deny|Disable|Disconnect|Dismount|Edit|Enable|Enter|Exit|Expand|Export|Find|ForEach|Format|Get|Grant|Group|Hide|Import|Initialize|Install|Invoke|Join|Limit|Lock|Measure|Merge|Move|New|Open|Optimize|Out|Ping|Pop|Protect|Publish|Push|Read|Receive|Redo|Register|Remove|Rename|Repair|Request|Reset|Resize|Resolve|Restart|Restore|Resume|Revoke|Save|Search|Select|Send|Set|Show|Skip|Sort|Split|Start|Step|Stop|Submit|Suspend|Switch|Sync|Tee|Test|Trace|Unblock|Undo|Uninstall|Unlock|Unprotect|Unpublish|Unregister|Update|Use|Wait|Watch|Where|Write)-[a-z]+\b/i,
        /\b(?:ac|cat|chdir|clc|cli|clp|clv|compare|copy|cp|cpi|cpp|cvpa|dbp|del|diff|dir|ebp|echo|epal|epcsv|epsn|erase|fc|fl|ft|fw|gal|gbp|gc|gci|gcs|gdr|gi|gl|gm|gp|gps|group|gsv|gu|gv|gwmi|iex|ii|ipal|ipcsv|ipsn|irm|iwmi|iwr|kill|lp|ls|measure|mi|mount|move|mp|mv|nal|ndr|ni|nv|ogv|popd|ps|pushd|pwd|rbp|rd|rdr|ren|ri|rm|rmdir|rni|rnp|rp|rv|rvpa|rwmi|sal|saps|sasv|sbp|sc|select|set|shcm|si|sl|sleep|sls|sort|sp|spps|spsv|start|sv|swmi|tee|trcm|type|write)\b/i,
      ],
      // per http://technet.microsoft.com/en-us/library/hh847744.aspx
      keyword: /\b(?:Begin|Break|Catch|Class|Continue|Data|Define|Do|DynamicParam|Else|ElseIf|End|Exit|Filter|Finally|For|ForEach|From|Function|If|InlineScript|Parallel|Param|Process|Return|Sequence|Switch|Throw|Trap|Try|Until|Using|Var|While|Workflow)\b/i,
      operator: {
        pattern: /(^|\W)(?:!|-(?:b?(?:and|x?or)|as|(?:Not)?(?:Contains|In|Like|Match)|eq|ge|gt|is(?:Not)?|Join|le|lt|ne|not|Replace|sh[lr])\b|-[-=]?|\+[+=]?|[*\/%]=?)/i,
        lookbehind: true,
      },
      punctuation: /[|{}[\];(),.]/,
    });

    // Variable interpolation inside strings, and nested expressions
    powershell.string[0].inside = {
      function: {
        // Allow for one level of nesting
        pattern: /(^|[^`])\$\((?:\$\([^\r\n()]*\)|(?!\$\()[^\r\n)])*\)/,
        lookbehind: true,
        inside: powershell,
      },
      boolean: powershell.boolean,
      variable: powershell.variable,
    };
  })(Prism);

  Prism.languages.python = {
    comment: {
      pattern: /(^|[^\\])#.*/,
      lookbehind: true,
      greedy: true,
    },
    'string-interpolation': {
      pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
      greedy: true,
      inside: {
        interpolation: {
          // "{" <expression> <optional "!s", "!r", or "!a"> <optional ":" format specifier> "}"
          pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
          lookbehind: true,
          inside: {
            'format-spec': {
              pattern: /(:)[^:(){}]+(?=\}$)/,
              lookbehind: true,
            },
            'conversion-option': {
              pattern: /![sra](?=[:}]$)/,
              alias: 'punctuation',
            },
            rest: null,
          },
        },
        string: /[\s\S]+/,
      },
    },
    'triple-quoted-string': {
      pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
      greedy: true,
      alias: 'string',
    },
    string: {
      pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
      greedy: true,
    },
    function: {
      pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
      lookbehind: true,
    },
    'class-name': {
      pattern: /(\bclass\s+)\w+/i,
      lookbehind: true,
    },
    decorator: {
      pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
      lookbehind: true,
      alias: ['annotation', 'punctuation'],
      inside: {
        punctuation: /\./,
      },
    },
    keyword: /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    boolean: /\b(?:False|None|True)\b/,
    number: /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
    operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    punctuation: /[{}[\];(),.:]/,
  };

  Prism.languages.python['string-interpolation'].inside[
      'interpolation'
      ].inside.rest = Prism.languages.python;

  Prism.languages.py = Prism.languages.python;

  (function (Prism) {
    var javascript = Prism.util.clone(Prism.languages.javascript);

    var space = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source;
    var braces = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source;
    var spread = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;

    /**
     * @param {string} source
     * @param {string} [flags]
     */
    function re(source, flags) {
      source = source
          .replace(/<S>/g, function () {
            return space;
          })
          .replace(/<BRACES>/g, function () {
            return braces;
          })
          .replace(/<SPREAD>/g, function () {
            return spread;
          });
      return RegExp(source, flags);
    }

    spread = re(spread).source;

    Prism.languages.jsx = Prism.languages.extend('markup', javascript);
    Prism.languages.jsx.tag.pattern = re(
        /<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/
            .source
    );

    Prism.languages.jsx.tag.inside['tag'].pattern = /^<\/?[^\s>\/]*/;
    Prism.languages.jsx.tag.inside[
        'attr-value'
        ].pattern = /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/;
    Prism.languages.jsx.tag.inside['tag'].inside[
        'class-name'
        ] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
    Prism.languages.jsx.tag.inside['comment'] = javascript['comment'];

    Prism.languages.insertBefore(
        'inside',
        'attr-name',
        {
          spread: {
            pattern: re(/<SPREAD>/.source),
            inside: Prism.languages.jsx,
          },
        },
        Prism.languages.jsx.tag
    );

    Prism.languages.insertBefore(
        'inside',
        'special-attr',
        {
          script: {
            // Allow for two levels of nesting
            pattern: re(/=<BRACES>/.source),
            alias: 'language-javascript',
            inside: {
              'script-punctuation': {
                pattern: /^=(?=\{)/,
                alias: 'punctuation',
              },
              rest: Prism.languages.jsx,
            },
          },
        },
        Prism.languages.jsx.tag
    );

    // The following will handle plain text inside tags
    var stringifyToken = function (token) {
      if (!token) {
        return '';
      }
      if (typeof token === 'string') {
        return token;
      }
      if (typeof token.content === 'string') {
        return token.content;
      }
      return token.content.map(stringifyToken).join('');
    };

    var walkTokens = function (tokens) {
      var openedTags = [];
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        var notTagNorBrace = false;

        if (typeof token !== 'string') {
          if (
              token.type === 'tag' &&
              token.content[0] &&
              token.content[0].type === 'tag'
          ) {
            // We found a tag, now find its kind

            if (token.content[0].content[0].content === '</') {
              // Closing tag
              if (
                  openedTags.length > 0 &&
                  openedTags[openedTags.length - 1].tagName ===
                  stringifyToken(token.content[0].content[1])
              ) {
                // Pop matching opening tag
                openedTags.pop();
              }
            } else {
              if (token.content[token.content.length - 1].content === '/>') {
                // Autoclosed tag, ignore
              } else {
                // Opening tag
                openedTags.push({
                  tagName: stringifyToken(token.content[0].content[1]),
                  openedBraces: 0,
                });
              }
            }
          } else if (
              openedTags.length > 0 &&
              token.type === 'punctuation' &&
              token.content === '{'
          ) {
            // Here we might have entered a JSX context inside a tag
            openedTags[openedTags.length - 1].openedBraces++;
          } else if (
              openedTags.length > 0 &&
              openedTags[openedTags.length - 1].openedBraces > 0 &&
              token.type === 'punctuation' &&
              token.content === '}'
          ) {
            // Here we might have left a JSX context inside a tag
            openedTags[openedTags.length - 1].openedBraces--;
          } else {
            notTagNorBrace = true;
          }
        }
        if (notTagNorBrace || typeof token === 'string') {
          if (
              openedTags.length > 0 &&
              openedTags[openedTags.length - 1].openedBraces === 0
          ) {
            // Here we are inside a tag, and not inside a JSX context.
            // That's plain text: drop any tokens matched.
            var plainText = stringifyToken(token);

            // And merge text with adjacent text
            if (
                i < tokens.length - 1 &&
                (typeof tokens[i + 1] === 'string' ||
                    tokens[i + 1].type === 'plain-text')
            ) {
              plainText += stringifyToken(tokens[i + 1]);
              tokens.splice(i + 1, 1);
            }
            if (
                i > 0 &&
                (typeof tokens[i - 1] === 'string' ||
                    tokens[i - 1].type === 'plain-text')
            ) {
              plainText = stringifyToken(tokens[i - 1]) + plainText;
              tokens.splice(i - 1, 1);
              i--;
            }

            tokens[i] = new Prism.Token(
                'plain-text',
                plainText,
                null,
                plainText
            );
          }
        }

        if (token.content && typeof token.content !== 'string') {
          walkTokens(token.content);
        }
      }
    };

    Prism.hooks.add('after-tokenize', function (env) {
      if (env.language !== 'jsx' && env.language !== 'tsx') {
        return;
      }
      walkTokens(env.tokens);
    });
  })(Prism);

  (function (Prism) {
    var typescript = Prism.util.clone(Prism.languages.typescript);
    Prism.languages.tsx = Prism.languages.extend('jsx', typescript);

    // doesn't work with TS because TS is too complex
    delete Prism.languages.tsx['parameter'];
    delete Prism.languages.tsx['literal-property'];

    // This will prevent collisions between TSX tags and TS generic types.
    // Idea by https://github.com/karlhorky
    // Discussion: https://github.com/PrismJS/prism/issues/2594#issuecomment-710666928
    var tag = Prism.languages.tsx.tag;
    tag.pattern = RegExp(
        /(^|[^\w$]|(?=<\/))/.source + '(?:' + tag.pattern.source + ')',
        tag.pattern.flags
    );
    tag.lookbehind = true;
  })(Prism);

  (function (Prism) {
    var specialEscape = {
      pattern: /\\[\\(){}[\]^$+*?|.]/,
      alias: 'escape',
    };
    var escape = /\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{[\da-fA-F]+\}|0[0-7]{0,2}|[123][0-7]{2}|c[a-zA-Z]|.)/;
    var charSet = {
      pattern: /\.|\\[wsd]|\\p\{[^{}]+\}/i,
      alias: 'class-name',
    };
    var charSetWithoutDot = {
      pattern: /\\[wsd]|\\p\{[^{}]+\}/i,
      alias: 'class-name',
    };

    var rangeChar = '(?:[^\\\\-]|' + escape.source + ')';
    var range = RegExp(rangeChar + '-' + rangeChar);

    // the name of a capturing group
    var groupName = {
      pattern: /(<|')[^<>']+(?=[>']$)/,
      lookbehind: true,
      alias: 'variable',
    };

    Prism.languages.regex = {
      'char-class': {
        pattern: /((?:^|[^\\])(?:\\\\)*)\[(?:[^\\\]]|\\[\s\S])*\]/,
        lookbehind: true,
        inside: {
          'char-class-negation': {
            pattern: /(^\[)\^/,
            lookbehind: true,
            alias: 'operator',
          },
          'char-class-punctuation': {
            pattern: /^\[|\]$/,
            alias: 'punctuation',
          },
          range: {
            pattern: range,
            inside: {
              escape: escape,
              'range-punctuation': {
                pattern: /-/,
                alias: 'operator',
              },
            },
          },
          'special-escape': specialEscape,
          'char-set': charSetWithoutDot,
          escape: escape,
        },
      },
      'special-escape': specialEscape,
      'char-set': charSet,
      backreference: [
        {
          // a backreference which is not an octal escape
          pattern: /\\(?![123][0-7]{2})[1-9]/,
          alias: 'keyword',
        },
        {
          pattern: /\\k<[^<>']+>/,
          alias: 'keyword',
          inside: {
            'group-name': groupName,
          },
        },
      ],
      anchor: {
        pattern: /[$^]|\\[ABbGZz]/,
        alias: 'function',
      },
      escape: escape,
      group: [
        {
          // https://docs.oracle.com/javase/10/docs/api/java/util/regex/Pattern.html
          // https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference?view=netframework-4.7.2#grouping-constructs

          // (), (?<name>), (?'name'), (?>), (?:), (?=), (?!), (?<=), (?<!), (?is-m), (?i-m:)
          pattern: /\((?:\?(?:<[^<>']+>|'[^<>']+'|[>:]|<?[=!]|[idmnsuxU]+(?:-[idmnsuxU]+)?:?))?/,
          alias: 'punctuation',
          inside: {
            'group-name': groupName,
          },
        },
        {
          pattern: /\)/,
          alias: 'punctuation',
        },
      ],
      quantifier: {
        pattern: /(?:[+*?]|\{\d+(?:,\d*)?\})[?+]?/,
        alias: 'number',
      },
      alternation: {
        pattern: /\|/,
        alias: 'keyword',
      },
    };
  })(Prism);

  (function (Prism) {
    Prism.languages.sass = Prism.languages.extend('css', {
      // Sass comments don't need to be closed, only indented
      comment: {
        pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t].+)*/m,
        lookbehind: true,
        greedy: true,
      },
    });

    Prism.languages.insertBefore('sass', 'atrule', {
      // We want to consume the whole line
      'atrule-line': {
        // Includes support for = and + shortcuts
        pattern: /^(?:[ \t]*)[@+=].+/m,
        greedy: true,
        inside: {
          atrule: /(?:@[\w-]+|[+=])/,
        },
      },
    });
    delete Prism.languages.sass.atrule;

    var variable = /\$[-\w]+|#\{\$[-\w]+\}/;
    var operator = [
      /[+*\/%]|[=!]=|<=?|>=?|\b(?:and|not|or)\b/,
      {
        pattern: /(\s)-(?=\s)/,
        lookbehind: true,
      },
    ];

    Prism.languages.insertBefore('sass', 'property', {
      // We want to consume the whole line
      'variable-line': {
        pattern: /^[ \t]*\$.+/m,
        greedy: true,
        inside: {
          punctuation: /:/,
          variable: variable,
          operator: operator,
        },
      },
      // We want to consume the whole line
      'property-line': {
        pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s].*)/m,
        greedy: true,
        inside: {
          property: [
            /[^:\s]+(?=\s*:)/,
            {
              pattern: /(:)[^:\s]+/,
              lookbehind: true,
            },
          ],
          punctuation: /:/,
          variable: variable,
          operator: operator,
          important: Prism.languages.sass.important,
        },
      },
    });
    delete Prism.languages.sass.property;
    delete Prism.languages.sass.important;

    // Now that whole lines for other patterns are consumed,
    // what's left should be selectors
    Prism.languages.insertBefore('sass', 'punctuation', {
      selector: {
        pattern: /^([ \t]*)\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*)*/m,
        lookbehind: true,
        greedy: true,
      },
    });
  })(Prism);

  Prism.languages.scss = Prism.languages.extend('css', {
    comment: {
      pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
      lookbehind: true,
    },
    atrule: {
      pattern: /@[\w-](?:\([^()]+\)|[^()\s]|\s+(?!\s))*?(?=\s+[{;])/,
      inside: {
        rule: /@[\w-]+/,
        // See rest below
      },
    },
    // url, compassified
    url: /(?:[-a-z]+-)?url(?=\()/i,
    // CSS selector regex is not appropriate for Sass
    // since there can be lot more things (var, @ directive, nesting..)
    // a selector must start at the end of a property or after a brace (end of other rules or nesting)
    // it can contain some characters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
    // the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
    // can "pass" as a selector- e.g: proper#{$erty})
    // this one was hard to do, so please be careful if you edit this one :)
    selector: {
      // Initial look-ahead is used to prevent matching of blank selectors
      pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()\s]|\s+(?!\s)|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}][^:{}]*[:{][^}]))/,
      inside: {
        parent: {
          pattern: /&/,
          alias: 'important',
        },
        placeholder: /%[-\w]+/,
        variable: /\$[-\w]+|#\{\$[-\w]+\}/,
      },
    },
    property: {
      pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/,
      inside: {
        variable: /\$[-\w]+|#\{\$[-\w]+\}/,
      },
    },
  });

  Prism.languages.insertBefore('scss', 'atrule', {
    keyword: [
      /@(?:content|debug|each|else(?: if)?|extend|for|forward|function|if|import|include|mixin|return|use|warn|while)\b/i,
      {
        pattern: /( )(?:from|through)(?= )/,
        lookbehind: true,
      },
    ],
  });

  Prism.languages.insertBefore('scss', 'important', {
    // var and interpolated vars
    variable: /\$[-\w]+|#\{\$[-\w]+\}/,
  });

  Prism.languages.insertBefore('scss', 'function', {
    'module-modifier': {
      pattern: /\b(?:as|hide|show|with)\b/i,
      alias: 'keyword',
    },
    placeholder: {
      pattern: /%[-\w]+/,
      alias: 'selector',
    },
    statement: {
      pattern: /\B!(?:default|optional)\b/i,
      alias: 'keyword',
    },
    boolean: /\b(?:false|true)\b/,
    null: {
      pattern: /\bnull\b/,
      alias: 'keyword',
    },
    operator: {
      pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|not|or)(?=\s)/,
      lookbehind: true,
    },
  });

  Prism.languages.scss['atrule'].inside.rest = Prism.languages.scss;

  (function (Prism) {
    // CAREFUL!
    // The following patterns are concatenated, so the group referenced by a back reference is non-obvious!

    var strings = [
      // normal string
      /"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/.source,
      /'[^']*'/.source,
      /\$'(?:[^'\\]|\\[\s\S])*'/.source,

      // here doc
      // 2 capturing groups
      /<<-?\s*(["']?)(\w+)\1\s[\s\S]*?[\r\n]\2/.source,
    ].join('|');

    Prism.languages['shell-session'] = {
      command: {
        pattern: RegExp(
            // user info
            /^/.source +
            '(?:' +
            // <user> ":" ( <path> )?
            (/[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+(?::[^\0-\x1F$#%*?"<>:;|]+)?/
                    .source +
                '|' +
                // <path>
                // Since the path pattern is quite general, we will require it to start with a special character to
                // prevent false positives.
                /[/~.][^\0-\x1F$#%*?"<>@:;|]*/.source) +
            ')?' +
            // shell symbol
            /[$#%](?=\s)/.source +
            // bash command
            /(?:[^\\\r\n \t'"<$]|[ \t](?:(?!#)|#.*$)|\\(?:[^\r]|\r\n?)|\$(?!')|<(?!<)|<<str>>)+/.source.replace(
                /<<str>>/g,
                function () {
                  return strings;
                }
            ),
            'm'
        ),
        greedy: true,
        inside: {
          info: {
            // foo@bar:~/files$ exit
            // foo@bar$ exit
            // ~/files$ exit
            pattern: /^[^#$%]+/,
            alias: 'punctuation',
            inside: {
              user: /^[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+/,
              punctuation: /:/,
              path: /[\s\S]+/,
            },
          },
          bash: {
            pattern: /(^[$#%]\s*)\S[\s\S]*/,
            lookbehind: true,
            alias: 'language-bash',
            inside: Prism.languages.bash,
          },
          'shell-symbol': {
            pattern: /^[$#%]/,
            alias: 'important',
          },
        },
      },
      output: /.(?:.*(?:[\r\n]|.$))*/,
    };

    Prism.languages['sh-session'] = Prism.languages['shellsession'] =
        Prism.languages['shell-session'];
  })(Prism);

  Prism.languages.sql = {
    comment: {
      pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
      lookbehind: true,
    },
    variable: [
      {
        pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
        greedy: true,
      },
      /@[\w.$]+/,
    ],
    string: {
      pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
      greedy: true,
      lookbehind: true,
    },
    identifier: {
      pattern: /(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,
      greedy: true,
      lookbehind: true,
      inside: {
        punctuation: /^`|`$/,
      },
    },
    function: /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i, // Should we highlight user defined functions too?
    keyword: /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
    boolean: /\b(?:FALSE|NULL|TRUE)\b/i,
    number: /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
    operator: /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
    punctuation: /[;[\]()`,.]/,
  };

  (function (Prism) {
    var key = /(?:[\w-]+|'[^'\n\r]*'|"(?:\\.|[^\\"\r\n])*")/.source;

    /**
     * @param {string} pattern
     */
    function insertKey(pattern) {
      return pattern.replace(/__/g, function () {
        return key;
      });
    }

    Prism.languages.toml = {
      comment: {
        pattern: /#.*/,
        greedy: true,
      },
      table: {
        pattern: RegExp(
            insertKey(
                /(^[\t ]*\[\s*(?:\[\s*)?)__(?:\s*\.\s*__)*(?=\s*\])/.source
            ),
            'm'
        ),
        lookbehind: true,
        greedy: true,
        alias: 'class-name',
      },
      key: {
        pattern: RegExp(
            insertKey(/(^[\t ]*|[{,]\s*)__(?:\s*\.\s*__)*(?=\s*=)/.source),
            'm'
        ),
        lookbehind: true,
        greedy: true,
        alias: 'property',
      },
      string: {
        pattern: /"""(?:\\[\s\S]|[^\\])*?"""|'''[\s\S]*?'''|'[^'\n\r]*'|"(?:\\.|[^\\"\r\n])*"/,
        greedy: true,
      },
      date: [
        {
          // Offset Date-Time, Local Date-Time, Local Date
          pattern: /\b\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?\b/i,
          alias: 'number',
        },
        {
          // Local Time
          pattern: /\b\d{2}:\d{2}:\d{2}(?:\.\d+)?\b/,
          alias: 'number',
        },
      ],
      number: /(?:\b0(?:x[\da-zA-Z]+(?:_[\da-zA-Z]+)*|o[0-7]+(?:_[0-7]+)*|b[10]+(?:_[10]+)*))\b|[-+]?\b\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?\b|[-+]?\b(?:inf|nan)\b/,
      boolean: /\b(?:false|true)\b/,
      punctuation: /[.,=[\]{}]/,
    };
  })(Prism);

  (function (Prism) {
    /**
     * If the given language is present, it will insert the given doc comment grammar token into it.
     *
     * @param {string} lang
     * @param {any} docComment
     */
    function insertDocComment(lang, docComment) {
      if (Prism.languages[lang]) {
        Prism.languages.insertBefore(lang, 'comment', {
          'doc-comment': docComment,
        });
      }
    }

    var tag = Prism.languages.markup.tag;

    var slashDocComment = {
      pattern: /\/\/\/.*/,
      greedy: true,
      alias: 'comment',
      inside: {
        tag: tag,
      },
    };
    var tickDocComment = {
      pattern: /'''.*/,
      greedy: true,
      alias: 'comment',
      inside: {
        tag: tag,
      },
    };

    insertDocComment('csharp', slashDocComment);
    insertDocComment('fsharp', slashDocComment);
    insertDocComment('vbnet', tickDocComment);
  })(Prism);

  (function (Prism) {
    // https://yaml.org/spec/1.2/spec.html#c-ns-anchor-property
    // https://yaml.org/spec/1.2/spec.html#c-ns-alias-node
    var anchorOrAlias = /[*&][^\s[\]{},]+/;
    // https://yaml.org/spec/1.2/spec.html#c-ns-tag-property
    var tag = /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/;
    // https://yaml.org/spec/1.2/spec.html#c-ns-properties(n,c)
    var properties =
        '(?:' +
        tag.source +
        '(?:[ \t]+' +
        anchorOrAlias.source +
        ')?|' +
        anchorOrAlias.source +
        '(?:[ \t]+' +
        tag.source +
        ')?)';
    // https://yaml.org/spec/1.2/spec.html#ns-plain(n,c)
    // This is a simplified version that doesn't support "#" and multiline keys
    // All these long scarry character classes are simplified versions of YAML's characters
    var plainKey = /(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(
        /<PLAIN>/g,
        function () {
          return /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/
              .source;
        }
    );
    var string = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;

    /**
     *
     * @param {string} value
     * @param {string} [flags]
     * @returns {RegExp}
     */
    function createValuePattern(value, flags) {
      flags = (flags || '').replace(/m/g, '') + 'm'; // add m flag
      var pattern = /([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source
          .replace(/<<prop>>/g, function () {
            return properties;
          })
          .replace(/<<value>>/g, function () {
            return value;
          });
      return RegExp(pattern, flags);
    }

    Prism.languages.yaml = {
      scalar: {
        pattern: RegExp(
            /([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(
                /<<prop>>/g,
                function () {
                  return properties;
                }
            )
        ),
        lookbehind: true,
        alias: 'string',
      },
      comment: /#.*/,
      key: {
        pattern: RegExp(
            /((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source
                .replace(/<<prop>>/g, function () {
                  return properties;
                })
                .replace(/<<key>>/g, function () {
                  return '(?:' + plainKey + '|' + string + ')';
                })
        ),
        lookbehind: true,
        greedy: true,
        alias: 'atrule',
      },
      directive: {
        pattern: /(^[ \t]*)%.+/m,
        lookbehind: true,
        alias: 'important',
      },
      datetime: {
        pattern: createValuePattern(
            /\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/
                .source
        ),
        lookbehind: true,
        alias: 'number',
      },
      boolean: {
        pattern: createValuePattern(/false|true/.source, 'i'),
        lookbehind: true,
        alias: 'important',
      },
      null: {
        pattern: createValuePattern(/null|~/.source, 'i'),
        lookbehind: true,
        alias: 'important',
      },
      string: {
        pattern: createValuePattern(string),
        lookbehind: true,
        greedy: true,
      },
      number: {
        pattern: createValuePattern(
            /[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/
                .source,
            'i'
        ),
        lookbehind: true,
      },
      tag: tag,
      important: anchorOrAlias,
      punctuation: /---|[:[\]{}\-,|>?]|\.\.\./,
    };

    Prism.languages.yml = Prism.languages.yaml;
  })(Prism);

  (function () {
    if (typeof Prism === 'undefined' || typeof document === 'undefined') {
      return;
    }

    /**
     * Plugin name which is used as a class name for <pre> which is activating the plugin
     *
     * @type {string}
     */
    var PLUGIN_NAME = 'line-numbers';

    /**
     * Regular expression used for determining line breaks
     *
     * @type {RegExp}
     */
    var NEW_LINE_EXP = /\n(?!$)/g;

    /**
     * Global exports
     */
    var config = (Prism.plugins.lineNumbers = {
      /**
       * Get node for provided line number
       *
       * @param {Element} element pre element
       * @param {number} number line number
       * @returns {Element|undefined}
       */
      getLine: function (element, number) {
        if (
            element.tagName !== 'PRE' ||
            !element.classList.contains(PLUGIN_NAME)
        ) {
          return;
        }

        var lineNumberRows = element.querySelector('.line-numbers-rows');
        if (!lineNumberRows) {
          return;
        }
        var lineNumberStart =
            parseInt(element.getAttribute('data-start'), 10) || 1;
        var lineNumberEnd =
            lineNumberStart + (lineNumberRows.children.length - 1);

        if (number < lineNumberStart) {
          number = lineNumberStart;
        }
        if (number > lineNumberEnd) {
          number = lineNumberEnd;
        }

        var lineIndex = number - lineNumberStart;

        return lineNumberRows.children[lineIndex];
      },

      /**
       * Resizes the line numbers of the given element.
       *
       * This function will not add line numbers. It will only resize existing ones.
       *
       * @param {HTMLElement} element A `<pre>` element with line numbers.
       * @returns {void}
       */
      resize: function (element) {
        resizeElements([element]);
      },

      /**
       * Whether the plugin can assume that the units font sizes and margins are not depended on the size of
       * the current viewport.
       *
       * Setting this to `true` will allow the plugin to do certain optimizations for better performance.
       *
       * Set this to `false` if you use any of the following CSS units: `vh`, `vw`, `vmin`, `vmax`.
       *
       * @type {boolean}
       */
      assumeViewportIndependence: true,
    });

    /**
     * Resizes the given elements.
     *
     * @param {HTMLElement[]} elements
     */
    function resizeElements(elements) {
      elements = elements.filter(function (e) {
        var codeStyles = getStyles(e);
        var whiteSpace = codeStyles['white-space'];
        return whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line';
      });

      if (elements.length == 0) {
        return;
      }

      var infos = elements
          .map(function (element) {
            var codeElement = element.querySelector('code');
            var lineNumbersWrapper = element.querySelector('.line-numbers-rows');
            if (!codeElement || !lineNumbersWrapper) {
              return undefined;
            }

            /** @type {HTMLElement} */
            var lineNumberSizer = element.querySelector('.line-numbers-sizer');
            var codeLines = codeElement.textContent.split(NEW_LINE_EXP);

            if (!lineNumberSizer) {
              lineNumberSizer = document.createElement('span');
              lineNumberSizer.className = 'line-numbers-sizer';

              codeElement.appendChild(lineNumberSizer);
            }

            lineNumberSizer.innerHTML = '0';
            lineNumberSizer.style.display = 'block';

            var oneLinerHeight = lineNumberSizer.getBoundingClientRect().height;
            lineNumberSizer.innerHTML = '';

            return {
              element: element,
              lines: codeLines,
              lineHeights: [],
              oneLinerHeight: oneLinerHeight,
              sizer: lineNumberSizer,
            };
          })
          .filter(Boolean);

      infos.forEach(function (info) {
        var lineNumberSizer = info.sizer;
        var lines = info.lines;
        var lineHeights = info.lineHeights;
        var oneLinerHeight = info.oneLinerHeight;

        lineHeights[lines.length - 1] = undefined;
        lines.forEach(function (line, index) {
          if (line && line.length > 1) {
            var e = lineNumberSizer.appendChild(document.createElement('span'));
            e.style.display = 'block';
            e.textContent = line;
          } else {
            lineHeights[index] = oneLinerHeight;
          }
        });
      });

      infos.forEach(function (info) {
        var lineNumberSizer = info.sizer;
        var lineHeights = info.lineHeights;

        var childIndex = 0;
        for (var i = 0; i < lineHeights.length; i++) {
          if (lineHeights[i] === undefined) {
            lineHeights[i] = lineNumberSizer.children[
                childIndex++
                ].getBoundingClientRect().height;
          }
        }
      });

      infos.forEach(function (info) {
        var lineNumberSizer = info.sizer;
        var wrapper = info.element.querySelector('.line-numbers-rows');

        lineNumberSizer.style.display = 'none';
        lineNumberSizer.innerHTML = '';

        info.lineHeights.forEach(function (height, lineNumber) {
          wrapper.children[lineNumber].style.height = height + 'px';
        });
      });
    }

    /**
     * Returns style declarations for the element
     *
     * @param {Element} element
     */
    function getStyles(element) {
      if (!element) {
        return null;
      }

      return window.getComputedStyle
          ? getComputedStyle(element)
          : element.currentStyle || null;
    }

    var lastWidth = undefined;
    window.addEventListener('resize', function () {
      if (
          config.assumeViewportIndependence &&
          lastWidth === window.innerWidth
      ) {
        return;
      }
      lastWidth = window.innerWidth;

      resizeElements(
          Array.prototype.slice.call(
              document.querySelectorAll('pre.' + PLUGIN_NAME)
          )
      );
    });

    Prism.hooks.add('complete', function (env) {
      if (!env.code) {
        return;
      }

      var code = /** @type {Element} */ (env.element);
      var pre = /** @type {HTMLElement} */ (code.parentNode);

      // works only for <code> wrapped inside <pre> (not inline)
      if (!pre || !/pre/i.test(pre.nodeName)) {
        return;
      }

      // Abort if line numbers already exists
      if (code.querySelector('.line-numbers-rows')) {
        return;
      }

      // only add line numbers if <code> or one of its ancestors has the `line-numbers` class
      if (!Prism.util.isActive(code, PLUGIN_NAME)) {
        return;
      }

      // Remove the class 'line-numbers' from the <code>
      code.classList.remove(PLUGIN_NAME);
      // Add the class 'line-numbers' to the <pre>
      pre.classList.add(PLUGIN_NAME);

      var match = env.code.match(NEW_LINE_EXP);
      var linesNum = match ? match.length + 1 : 1;
      var lineNumbersWrapper;

      var lines = new Array(linesNum + 1).join('<span></span>');

      lineNumbersWrapper = document.createElement('span');
      lineNumbersWrapper.setAttribute('aria-hidden', 'true');
      lineNumbersWrapper.className = 'line-numbers-rows';
      lineNumbersWrapper.innerHTML = lines;

      if (pre.hasAttribute('data-start')) {
        pre.style.counterReset =
            'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
      }

      env.element.appendChild(lineNumbersWrapper);

      resizeElements([pre]);

      Prism.hooks.run('line-numbers', env);
    });

    Prism.hooks.add('line-numbers', function (env) {
      env.plugins = env.plugins || {};
      env.plugins.lineNumbers = true;
    });
  })();
}
