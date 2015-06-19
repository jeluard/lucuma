(defproject lucuma "0.5.0-SNAPSHOT"
  :description "A Custom Elements library for ClojureScript"
  :url "https://github.com/jeluard/lucuma"
  :license  {:name "Eclipse Public License"
             :url "http://www.eclipse.org/legal/epl-v10.html"}
  :source-paths  ["src" "test"]
  :dependencies [[org.clojure/tools.macro "0.1.2"]]
  :profiles
  {:dev
    {:dependencies [[org.clojure/clojure "1.7.0-RC2"]
                    [org.clojure/clojurescript "0.0-3211"]
                    [cljsjs/document-register-element "0.4.3-0"]]
     :plugins [[lein-cljsbuild "1.0.5"]
               [com.cemerick/clojurescript.test "0.3.3"]]}}
  :cljsbuild
  {:builds
   {:test
    {:source-paths ["src" "test"]
     :compiler {:output-to "target/cljs/unit-test.js"
                :optimizations :whitespace}}}
   :test-commands {"slimerjs" ["slimerjs" :runner "target/cljs/unit-test.js"]}}
  :aliases {"clean-test" ["do" "clean," "cljsbuild" "test"]
            "clean-install" ["do" "clean," "install"]}
  :min-lein-version "2.5.0")
