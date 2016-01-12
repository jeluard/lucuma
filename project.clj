(defproject lucuma "0.5.2-SNAPSHOT"
  :description "A Custom Elements library for ClojureScript"
  :url "https://github.com/jeluard/lucuma"
  :license  {:name "Eclipse Public License"
             :url "http://www.eclipse.org/legal/epl-v10.html"}
  :source-paths  ["src" "test"]
  :profiles
  {:dev
    {:dependencies [[org.clojure/clojure "1.7.0"]
                    [org.clojure/clojurescript "1.7.170"]
                    [cljsjs/document-register-element "0.5.3-1"]]
     :plugins [[lein-cljsbuild "1.1.2"]
               [lein-doo "0.1.6"]]}}
  :cljsbuild
  {:builds
   {:test
    {:source-paths ["src" "test"]
     :compiler {:output-to "target/cljs/unit-test.js"
                :main 'lucuma.runner
                :optimizations :none}}}}
  :aliases {"clean-test" ["do" "clean," "doo" "slimer" "test" "once"]
            "clean-install" ["do" "clean," "install"]}
  :min-lein-version "2.5.0")
