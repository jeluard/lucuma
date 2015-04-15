(defproject lucuma "0.5.0-SNAPSHOT"
  :description "A Web Components library for ClojureScript"
  :url "https://github.com/jeluard/lucuma"
  :license  {:name "Eclipse Public License"
             :url "http://www.eclipse.org/legal/epl-v10.html"}
  :source-paths  ["src" "test"]
  :profiles
  {:dev
    {:dependencies [[org.clojure/clojure "1.7.0-beta1"]
                    [org.clojure/clojurescript "0.0-3196"]
                    [cljsjs/document-register-element "0.2.1-0"]]
     :plugins [[lein-cljsbuild "1.0.5"]
               [com.cemerick/clojurescript.test "0.3.4-SNAPSHOT"]]}}
  :cljsbuild
  {:builds
   {:test
    {:source-paths ["src" "test"]
     :compiler {:output-to "target/cljs/unit-test.js"
                :optimizations :whitespace}}}
   :test-commands {"slimerjs" ["slimerjs" :runner "dev-resources/document-register-element-0.1.2.js" "target/cljs/unit-test.js"]
                   "phantomjs" ["phantomjs" :runner "dev-resources/document-register-element-0.1.2.js" "target/cljs/unit-test.js"]}}
  :aliases {"clean-test" ["do" "clean," "cljsbuild" "test"]
            "clean-install" ["do" "clean," "install"]}
  :min-lein-version "2.5.0")
