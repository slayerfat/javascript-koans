var _; //globals
var Factorizer = function () {
  this.number = null;
  this.range = null;
  this.factors = [];

  /**
   * Find the smallest prime from a composite number, example: 15, 18, 27, 63, etc.
   *
   * @param {number} number
   * @returns {number}
   */
  this.smallest = function (number) {
    if (number <= 1) {
      return number;
    }

    this._init(number);
    return this._findSmallest(this.factors);
  };

  /**
   * Find the largest prime from a composite number, example: 15, 18, 27, 63, etc.
   *
   * @param {number} number
   * @returns {number}
   */
  this.largest = function (number) {
    if (number <= 1) {
      return number;
    }

    this._init(number);
    return this._findLargest(this.factors);
  };

  this.find = function (target) {
    if (target <= 2) {
      return target;
    }

    var i = 2;

    this._init(i);

    // we have to loop until the number of factors are the target
    do {
      // if i is divisible by a factor, then is not a prime.
      var isPrime = _(this.factors).all(function (f) {
        return i % f !== 0;
      });

      if (isPrime) {
        this.factors.push(i);
      }

      i++;
    } while (this.factors.length < target);

    return this.factors.pop();
  };

  /**
   * Sets the attributes at
   *
   * @param {number} number
   * @private
   */
  this._init = function (number) {
    this.number = number;
    this.range = _.range(2, number + 1);
    this._findFactors();
  };

  /**
   * Finds the real smallest prime behind all possible
   * composites in a range of int numbers.
   *
   * @param {Array} array
   * @returns {number}
   * @private
   */
  this._findSmallest = function (array) {
    var max = array.pop();

    var results = _(array).filter(this._filterFactors.bind(this));

    if (results.length) {
      return this._findSmallest(results);
    }

    return max;
  };

  /**
   * Finds the real largest prime behind all possible
   * composites in a range of int numbers.
   *
   * @param {Array} array
   * @returns {number}
   * @private
   */
  this._findLargest = function (array) {
    var max = array.pop();

    var results = _(array).filter(function (f) {
      return max % f === 0;
    });

    if (results.length) {
      return this._findLargest(results);
    }

    return max;
  };

  /**
   * Finds all the factors of a range of numbers, counting composite factors.
   *
   * @returns {number[]}
   * @private
   */
  this._findFactors = function () {
    var results = _(this.range).filter(this._filterFactors.bind(this));

    if (results.length) {
      return this.factors = results;
    }

    this.factors = [this.number];
  };

  /**
   * Check if a number is divisible by the target.
   * The target is the number inside the range already made.
   *
   * @param {number} number
   * @returns {boolean}
   * @private
   */
  this._filterFactors = function (number) {
    if (number <= 1) {
      return false;
    }

    return this.number % number === 0;
  };
};

describe("About Applying What We Have Learnt", function () {

  var products;

  beforeEach(function () {
    products = [
      {
        name: "Sonoma",
        ingredients: ["artichoke", "sundried tomatoes", "mushrooms"],
        containsNuts: false
      },
      {
        name: "Pizza Primavera",
        ingredients: ["roma", "sundried tomatoes", "goats cheese", "rosemary"],
        containsNuts: false
      },
      {
        name: "South Of The Border",
        ingredients: ["black beans", "jalapenos", "mushrooms"],
        containsNuts: false
      },
      {name: "Blue Moon", ingredients: ["blue cheese", "garlic", "walnuts"], containsNuts: true},
      {
        name: "Taste Of Athens",
        ingredients: ["spinach", "kalamata olives", "sesame seeds"],
        containsNuts: true
      }
    ];
  });

  /*********************************************************************************/

  it("given I'm allergic to nuts and hate mushrooms, it should find a pizza I can eat (imperative)", function () {

    var i, j, hasMushrooms, productsICanEat = [];

    for (i = 0; i < products.length; i += 1) {
      if (products[i].containsNuts === false) {
        hasMushrooms = false;
        for (j = 0; j < products[i].ingredients.length; j += 1) {
          if (products[i].ingredients[j] === "mushrooms") {
            hasMushrooms = true;
          }
        }
        if (!hasMushrooms) productsICanEat.push(products[i]);
      }
    }

    expect(productsICanEat.length).toBe(1);
  });

  it("given I'm allergic to nuts and hate mushrooms, it should find a pizza I can eat (functional)", function () {

    var productsICanEat = [];

    productsICanEat.push(_(products).filter(function (product) {
      if (product.containsNuts !== true) {
        return _(product.ingredients).all(function (i) {
          return i !== 'mushrooms';
        });
      }
    }));

    /* solve using filter() & all() / any() */

    expect(productsICanEat.length).toBe(1);
  });

  /*********************************************************************************/

  it("should add all the natural numbers below 1000 that are multiples of 3 or 5 (imperative)", function () {

    var sum = 0;
    for (var i = 1; i < 1000; i += 1) {
      if (i % 3 === 0 || i % 5 === 0) {
        sum += i;
      }
    }

    expect(sum).toBe(233168);
  });

  it("should add all the natural numbers below 1000 that are multiples of 3 or 5 (functional)", function () {

    var sum = _.range(0, 1000).reduce(function (sum, i) {
      if (i % 3 === 0 || i % 5 === 0) {
        return sum += i;
      }

      return sum;
    });
    /* try chaining range() and reduce() */

    expect(233168).toBe(sum);
  });

  /*********************************************************************************/
  it("should count the ingredient occurrence (imperative)", function () {
    var ingredientCount = {"{ingredient name}": 0};

    for (i = 0; i < products.length; i += 1) {
      for (j = 0; j < products[i].ingredients.length; j += 1) {
        ingredientCount[products[i].ingredients[j]] = (ingredientCount[products[i].ingredients[j]] || 0) + 1;
      }
    }

    expect(ingredientCount['mushrooms']).toBe(2);
  });

  it("should count the ingredient occurrence (functional)", function () {
    var ingredientCount = {"{ingredient name}": 0};

    products.forEach(function (product) {
      product.ingredients.forEach(function (i) {
        ingredientCount[i] = (ingredientCount[i] || 0) + 1;
      });
    });
    /* chain() together map(), flatten() and reduce() */

    expect(ingredientCount['mushrooms']).toBe(2);
  });

  /*********************************************************************************/
  /* UNCOMMENT FOR EXTRA CREDIT */
  describe('Factors', function () {
    var factor;
    beforeEach(function () {
      factor = new Factorizer();
    })

    it("should find the largest prime factor of a composite number OOP", function () {
      expect(factor.largest(15)).toBe(5);
      expect(factor.largest(105)).toBe(7);
      expect(factor.largest(1925)).toBe(11);
    });

    it("should find the largest prime factor of a composite number functions", function () {
      var greatestFactor = function (number) {
        var factors = [];
        number = number || 0;

        if (number <= 2) {
          return number;
        }

        for (var i = 2; i < number; i++) {
          // number is divisible by a factor or a composite of it.
          if (number % i === 0) {
            factors.push(i);
          }
        }

        // we need to check if the factor is divisible by other
        // if so, then is a composite.
        var findDivisible = function (array) {
          var max = array.pop();

          var results = _(array).filter(function (f) {
            return max % f === 0;
          });

          if (results.length) {
            return findDivisible(results);
          }

          return max;
        };

        return findDivisible(factors);
      };

      expect(greatestFactor(15)).toBe(5);
      expect(greatestFactor(105)).toBe(7);
      expect(greatestFactor(1925)).toBe(11);
    });

    it("should find the smallest number divisible by each of the numbers 1 to 20", function () {
      expect(factor.smallest(1)).toBe(1);
      expect(factor.smallest(2)).toBe(2);
      expect(factor.smallest(4)).toBe(2);
      expect(factor.smallest(16)).toBe(2);
      expect(factor.smallest(20)).toBe(2);
      expect(factor.smallest(18)).toBe(2);
      expect(factor.smallest(15)).toBe(3);
      expect(factor.smallest(63)).toBe(3);
      expect(factor.smallest(25)).toBe(5);
    });

    it("should find the 10001st prime", function () {
      expect(factor.find(10001)).toBe(104743);
    });
  });

  it("should find the largest palindrome made from the product of two 3 digit numbers", function () {
    var findGreatestPalindrome = function (x, y) {
      var product = x * y;
      var range = _.range(1, product + 1);

      return findPalindrome(range);
    };

    /**
     * Chop a string according to length.
     *
     * @param {string} string
     * @param {number} length
     * @param {boolean=} reverse
     * @returns {string}
     */
    var chopString = function (string, length, reverse) {
      var result = '';
      var i;

      if (reverse) {
        for (i = string.length - 1; i > length; i--) {
          result += string[i];
        }

        return result;
      }

      for (i = 0; i < length; i++) {
        result += string[i];
      }

      return result;
    };

    /**
     * Finds the first palindrome of the set.
     *
     * @param {number[]} array
     */
    var findPalindrome = function (array) {
      for (var i = array.length; i > 0; i--) {
        var number = array.pop();
        var string = number.toString();
        var half = Math.floor(string.length / 2);

        var firstHalf = chopString(string, half);
        var secondHalf = chopString(string, half, true);

        if (firstHalf == secondHalf) {
          return number;
        }

        return findPalindrome(array);
      }
    };

    expect(findGreatestPalindrome(11, 11)).toBe(121);
    expect(findGreatestPalindrome(11, 12)).toBe(131);
    expect(findGreatestPalindrome(11, 90)).toBe(989);
    expect(findGreatestPalindrome(101, 505)).toBe(50905);
  });

  it("should find the largest palindrome made from the product of two 3 digit numbers OOP style", function () {
    var Palindrome = {
      product: 0,
      range: null,
      string: null,
      length: null,
      findGreatestFromProduct: function (x, y) {
        this.product = x * y;
        this.range = _.range(1, this.product + 1);

        return this._findPalindrome();
      },

      /**
       * Finds the first palindrome of the set.
       */
      _findPalindrome: function () {
        for (var i = this.range.length; i > 0; i--) {
          var number = this.range.pop();
          this.string = number.toString();
          this.length = Math.floor(this.string.length / 2);

          var firstHalf = this._chopString();
          var secondHalf = this._chopString(true);

          if (firstHalf == secondHalf) {
            return number;
          }

          return this._findPalindrome();
        }
      },

      /**
       * Chop a string according to length.
       *
       * @param {boolean=} reverse
       * @returns {string}
       */
      _chopString: function (reverse) {
        var result = '';
        var i;

        if (reverse) {
          for (i = this.string.length - 1; i > this.length; i--) {
            result += this.string[i];
          }

          return result;
        }

        for (i = 0; i < this.length; i++) {
          result += this.string[i];
        }

        return result;
      }
    };

    expect(Palindrome.findGreatestFromProduct(11, 11)).toBe(121);
    expect(Palindrome.findGreatestFromProduct(11, 12)).toBe(131);
    expect(Palindrome.findGreatestFromProduct(11, 90)).toBe(989);
    expect(Palindrome.findGreatestFromProduct(101, 505)).toBe(50905);
  });

  it("should find the difference between the sum of the squares and the square of the sums", function () {
    var Sum = function () {
      this.squares = [];
      this.sum = 0;
      this.sumSq = 0;
      this.sqSum = 0;

      this.makeSqrAndSums = function () {
        for (var i = 1; i <= this.times; i++) {
          this.sum += this.target;
          this.squares.push(Math.pow(this.target, 2));
        }

        this.sumSq = _(this.squares).reduce(function (next, sq) {
          return next + sq;
        });

        this.sqSum = Math.pow(this.sum, 2);
      };

      this.difference = function (target, times) {
        this.target = target;
        this.times = times || 1;
        this.makeSqrAndSums();

        return this.sumSq <= this.sqSum;
      }
    };

    var sum = new Sum();

    // (a^2[1] + a^2[2]+...+a^2[n]) ≤ (a[1] + a[2]+...+a[n])^2
    // http://math.stackexchange.com/a/1180479
    expect(sum.difference(3, 10)).toBe(true);
    expect(sum.difference(5, 78)).toBe(true);
    expect(sum.difference(7, 7)).toBe(true);
    expect(sum.difference(11, 51)).toBe(true);
  });
});
