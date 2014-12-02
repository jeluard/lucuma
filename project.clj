(defproject lucuma "0.2.1-SNAPSHOT"
  :description "A Web Components library for ClojureScript"
  :url "https://github.com/jeluard/lucuma"
  :license  {:name "Eclipse Public License"
             :url "http://www.eclipse.org/legal/epl-v10.html"}
  :source-paths  ["src" "test"]
  :profiles
  {:dev
    {:dependencies [[org.clojure/clojure "1.6.0"]
                    [org.clojure/clojurescript "0.0-2371"]]
     :plugins [[lein-cljsbuild "1.0.3"]
               [com.cemerick/clojurescript.test "0.3.1"]]}}
  :cljsbuild
  {:builds
   {:test
    {:source-paths ["src" "test"]
     :compiler {:output-to "target/cljs/unit-test.js"
                :optimizations :simple}}}
   :test-commands {"slimerjs" ["slimerjs" :runner "dev-resources/document-register-element-0.0.8.js" "target/cljs/unit-test.js"]}}
  :aliases {"clean-test" ["do" "clean," "cljsbuild" "clean," "cljsbuild" "test"]
            "clean-install" ["do" "clean," "cljsbuild" "clean," "install"]}
  :min-lein-version "2.5.0")
