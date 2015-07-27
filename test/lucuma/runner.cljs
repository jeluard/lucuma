(ns lucuma.runner
    (:require [doo.runner :refer-macros [doo-tests]]
              [lucuma.attribute-test]
              [lucuma.core-test]
              [lucuma.custom-elements-test]
              [lucuma.util-test]))

(doo-tests 'lucuma.attribute-test
           'lucuma.core-test
           'lucuma.custom-elements-test
           'lucuma.util-test)
