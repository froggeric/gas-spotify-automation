function main() {

  // variableShuffle( ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 0.0 )
  // variableShuffle( ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 0.1 )
  // variableShuffle( ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 0.2 )
  // variableShuffle( ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 0.3 )
  // variableShuffle( ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 0.4 )
  // variableShuffle( ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 0.5 )
  // variableShuffle( ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 0.6 )
  // variableShuffle( ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 0.7 )
  // variableShuffle( ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 0.8 )
  // variableShuffle( ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 0.9 )
  // variableShuffle( ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 1.0 )

  test()
}

function test() {

  // let array = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  // let shufflePool =  Array.from(Array( array.length ).keys())
  // let length = array.length;
  // let randomIndex = 0;
  // Logger.log(array)
  // for (let i = 0 ; i < length ; i++) {
  //   randomIndex = Math.round( Math.random() * (shufflePool.length - 1) );
  //   shufflePool.splice( randomIndex, 1);
  //   Logger.log( randomIndex + ' : ' + shufflePool )
  //   // Logger.log(array)
  // }
  // // Logger.log(array)
  // // // let newArray = array.filter((_, index) => index != 3);
  // // array.splice(3,1);
  // // Logger.log(array.length)
  // // Logger.log(array)

  TestShuffle( 10, 100000, 0)
  TestShuffle( 10, 100000, 0.1)
  TestShuffle( 10, 100000, 0.2)
  TestShuffle( 10, 100000, 0.3)
  TestShuffle( 10, 100000, 0.4)
  TestShuffle( 10, 100000, 0.5)
  TestShuffle( 10, 100000, 0.6)
  TestShuffle( 10, 100000, 0.7)
  TestShuffle( 10, 100000, 0.8)
  TestShuffle( 10, 100000, 0.9)
  // TestShuffle( 10, 100000, 0.925)
  // TestShuffle( 10, 100000, 0.95)
  // TestShuffle( 10, 100000, 0.975)
  TestShuffle( 10, 100000, 1.0)

  function TestShuffle( size = 10, iterations = 10000, factor = 1.0) {

    // balancedShuffle( ['0','1','2','3','4','5','6','7','8','9'], 0.5 )

    let stats = Array(size).fill().map(x => new Array(size).fill(0));
    let testArray = [];
    let nullAlert = false;

    for (let x = 1; x <= iterations; x++) {
      testArray = Array.from(Array(size).keys()).map(x => x.toString());
      balancedShuffle( testArray, factor )
    }
    Logger.log( factor + ' :  ' + testArray)
    // convert array values to percentage
    let min = iterations;
    let max = 0;
    for (let a = 0; a < size; a++) {
      for (let b = 0; b < size; b++) {
        min = Math.min(min, stats[a][b]);
        max = Math.max(max, stats[a][b]);
        // stats[a][b] = Math.floor(100 * stats[a][b] / iterations).toString().padStart(2);
        stats[a][b] = stats[a][b].toString().padStart(6);
      }
    }
    // display stats
    for (let i = 0; i < size; i++) {
      Logger.log(stats[i])
    }
    if (nullAlert) {
      Logger.log('ERROR: null value(s) (index out of range)')
    }
    Logger.log('Values: ' + min + ' < ' + (iterations / size) + ' < ' + max)


    function balancedShuffle( array, factor = 1) {

      // Weighted shuffle
      // 0.0 pure order
      // 1.0 pure randomness

      // number of permutations we need to perform (percentage of the array length)
      let length = array.length;
      let permutations = length * factor;

      // Logger.log('length:' + length + ' factor:' + factor + ' permutations:' + permutations)

      // shuffled indexes matching the size of the array
      // This is used to remove bias that sequential processing would introduce
      //   The javascript code below generate an array of random _unique_ numbers from 0 to N
      //   Casing is important: Array is a built-in object, whereas array is our input variable
      // let shuffledIndexes = Array.from(Array(length).keys()).sort(_ => Math.random() - .5) // biased shuffling - do not use
      // let shuffledIndexes = Array.from(Array(length).keys());
      // for (let i = shuffledIndexes.length - 1; i > 0; i--) {
      //   let j = Math.floor(Math.random() * (i + 1));
      //   [shuffledIndexes[i], shuffledIndexes[j]] = [shuffledIndexes[j], shuffledIndexes[i]];
      // }

      // Initial pool of indexes mathing the size of the array to be sorted
      // This is not randomised, as random selection and splicing will occur during processing
      // That way is more efficient than having to do an initial full shuffle on it
      let shufflePool =  Array.from(Array( array.length ).keys())

      // Variable shuffle with with localised randomness factor
      for (let i = 0; i < permutations; i++) {
      // for (let i = 0; i < length; i++) {   // full iterations on all factor leads to very unbalanced or completed shuffle on partial shuffle

        // inefficient approach using a pre-randomised index array
        // let x = shuffledIndexes[i];
        // efficient approach picking a valid random index on the fly
        let randomIndex = Math.round( Math.random() * (shufflePool.length - 1) );
        let x = shufflePool[ randomIndex ];
        let y = x;
        shufflePool.splice( randomIndex, 1);
        // Logger.log( x + ' : ' + shufflePool )

        // // algo 0: original // biased on partial with more more shuffle on low end and linear decrease until upper end
          // // 0.1 OK but unbalanced as self value increase steadily toward the upper range 
          // // 0.5 OK but unbalanced as self value increase steadily toward the upper range
          // // 1.0 GOOD balanced  9778 < 10000 < 10200
          // let y = Math.floor(Math.random() * (x + 1));
        //

        // algo 1: original with weight
          // 0.1 BIAS
          // 0.5 BAD
          // 1.0 GOOD
          // i/length length/(i+1) length/(x+1) (i+1)/(x+1) (i)/(x+1)
          // 1a >>>> (x)/(i+1)               <<<< 47659 - 43041 [NULL]
          // 1b >>>> (x+1)/(i+1)             <<<< 62118 - 43851 [NULL]
          // 1c >>>> ((x+length)/(i+length)) <<<< 67005 - 53049 [NULL]
          // 1d >>>> (x/length)
          // 1e >>>> ((length - x)/length)
          // 1f >>>> ((length - i - 1 )/length)
          // (factor*(x+length)/(i+length)) ((x*factor)/(i+1)) ((i+length)/(x+length)) ((i+x)/(2*length)) ((2*length)/(i+x))
          // ((x)/(length-i)) ((x)/(length-x)) ((i)/(length-i)) ((i)/(length-i))
          // ((length-x)/(length-i)) ((length-x)/(length)) ((length-x)/(i+1)) ((length-x)/(x+1))
          // ((length-i)/(length-x)) ((length-i)/(length)) ((length-i)/(i+1)) ((length-i)/(x+1))
          // let r = Math.random() * (x + 1);
          // let y = Math.floor(r * factor + x * (1 - factor) );

        // // algo 1g // BAD
        //   let r  = Math.random();
        //   let y1 = Math.floor(r*factor + x*(1-factor) );
        //   let y2 = Math.floor(r*factor + x*(1-factor)*((length-i-1)/(length)) );
        // let y  = Math.floor((y1+y2)/2);


        // // algo 2: using length // unbalanced on full with slightly more shuffle on top end
        //   // 0.1 BIAS
        //   // 0.5 BIAS
        //   // 1.0 BAD self are lowest values 8895 < 10000 < 10481
        //   let r = Math.random() * length;
        //   let y = Math.floor(r * factor + x * (1 - factor));

        // // algo 3: combination with  with weight // unbalanced on full with more shuffle on self
        //   // 0.1 OK biased
        //   // 0.5 OK biased
        //   // 1.0 OK but self are lowest values 8943 < 10000 < 10434
        //   let r = Math.random()
        //   let lo = r * (x + 1);
        //   let hi = r * (length - x - 1);
        //   let y = Math.floor((lo + hi) * factor + x * (1 - factor));
        

        // // algo 4: mirror fisher yates
        //   // 0.1 BAD
        //   // 0.5 BAD
        //   // 1.0 GOOD
        //   let y = Math.floor( x + ( Math.random() * (length - x)));

        // // algo 5: mirror fisher yates with weight
          // // 0.1 OK
          // // 0.5 BAD
          // // 1.0 GOOD
          // let r =  x + ( Math.random() * (length - x));
          // let y = Math.floor(r * factor + (x + 1) * (1 - factor));

        // algo 6: original + mirror : only random component averaged (v1)
          // // 0.1 OK unbalanced 92%-99%
          // // 0.5 OK unbalamced
          // // 1.0 BAD 2%-18%
          // let r = Math.random();
          // let r1 = r * ( x + 1 );
          // let r2 = x + r * ( length - x );
          // let w = ( r1 + r2) / 2;
          // let y = Math.floor( w * factor + x * (1 - factor) );
        //

        // // algo 7: original + mirror : averaged (v2)
        //   // 0.1 GOOD but it seems it needs a higher factor to start shuffling
        //   // 0.5 GOOD almost perfectly balanced, 41%-63%
        //   // 1.0 BAD 2%-18%
        //   let r  = Math.random();
        //   let r1 = r * (x + 1);
        //   let r2 = x + r*(length-x);
        //   let y1 = r1*factor + x*(1-factor);
        //   let y2 = r2*factor + (x+1)*(1-factor);
        //   let y  = Math.floor( (y1+y2)/2 );
        //

        // random selection of algorithm
        if ( Math.random() < Math.pow(factor,2) ) {
          accumulationShuffle ()
        } else {
          reflectionShuffle ()
        }

        function accumulationShuffle() {
          // algo 8: original + mirror (v3)
          // B: r > factor
            // if ( Math.random() > factor ) {
            // 0.1 GOOD unbal + dec 94%-91% // 0.5 PERFECT 33%-68% // 1.0 PERFECT
          // C: r > factor * (1-factor)
            // if ( Math.random() > ( factor * (1-factor)) ) {
            // 0.1 GOOD slight unbal 94%-91% // 0.5 UNBALANCED // 1.0 PERFECT
          // D: x*r < f*(L-1)
            // if ( (Math.random() * x) < (factor * (length - 1)) ) {
            // 0.1 GOOD 84%-95% // 0.5 UNBALANCED // 1.0 PERFECT
          // E: x*r < (f^2 + (1-f)^2) * (L-1)
            // if ( (Math.random() * x) < ((Math.pow(factor,2) + Math.pow(1-factor,2)) * (length-1)) ) {
            // 0.1 OK 82%-95% // 0.5 UNBALANCED // 1.0 PERFECT
            let r = 0;
          // A: r < f^2 + (1-f)^2
            // if ( Math.random() < (Math.pow(factor,2) + Math.pow(1-factor,2)) ) {
            // 0.1 GOOD slight unbal 94%-91% // 0.5 PERFECT 33%-68% // 1.0 PERFECT
            // <=    0.1 : 99326 < 100000 < 101024   //   0.5: 680928 - 339586 - 680614
            // random selection of algorithm (A is the best choice)
            if ( Math.random() < (Math.pow(factor,2) + Math.pow(1-factor,2)) ) {
              // original
              r = Math.random() * (x + 1);
              y = Math.floor( r * factor + x * (1 - factor) );
            } else {
              // mirror
              r =  x + Math.random() * (length - x);
              y = Math.floor( r * factor + (x + 1) * (1 - factor) );
            }
        }

        function reflectionShuffle() {
          // algo 9: distance based, with reflection instead of absorption
          let top = length - 1;
          let distance = factor * top;
          let min = distance/2;
          let max = top - min;
          let bottom = x - min;
          if (x < min) {
            bottom = 0;
          }
          if (x > max) {
            bottom = top - distance;
          }
          let r = Math.random() * distance;
          y = Math.round( bottom + r);
          // Logger.log('factor:' + factor + ' length:' + length + ' distance:' + distance + ' <' + min +  '<' + max + '<    '+ x + '<->' + y + '    [' + bottom + '..'+ (bottom+distance) + ']')
        }  

        [array[x], array[y]] = [array[y], array[x]];

        // Logger.log('f:' + factor + '  ' + '  weight:' + Math.floor(weight) + '  distance:' + (y-x) + '    ' + x + '<->' + y)
      }


      // Logger.log( stats)
      for (let a = 0; a < size; a++) {
        for (let b = 0; b < size; b++) {
          if (array[b] == a) {
            stats[a][b]++;
          }
          if (array[b] == null) {
            nullAlert = true;
          }
          // Logger.log('stats[' + a + '][' + b +']:'+ stats[a][b] + ' array[b]:' + array[b] + ' = ' + a + ':a')
        }
      }
    }
  }
}

function variableShuffle( array, factor = 1) {

  // 0.0 pure order
  // 1.0 pure randomness

  // number of permutations we need to perform (percentage of the array length)
  let length = array.length;
  let permutations = length * factor;
  // Initial pool of indexes matching the size of the array to be sorted
  let shufflePool =  Array.from(Array( array.length ).keys())

  // pre-calculations for optimisation
  let algoSelectionThreshold = factor*factor + (1-factor)*(1-factor);
  
  // Variable shuffle with with localised randomness factor
  for (let i = 0; i < permutations; i++) {

    // Pick a valid random index number from the pool of indexes remaining
    let randomIndex = Math.round( Math.random() * (shufflePool.length - 1) );
    let x = shufflePool[ randomIndex ];
    // Removed the selected index number from the pool
    shufflePool.splice( randomIndex, 1);

    let r = 0;
    let y = x;
  
    // random selection of algorithm based on factor value, to remove partial shuffle bias
    if ( Math.random() < algoSelectionThreshold ) {
      // algo based on standard fisher yates with added weight
      r = Math.random() * (x + 1);
      y = Math.floor( r * factor + x * (1 - factor) );
    } else {
      // algo based on mirror fisher yates with added weight
      r =  x + Math.random() * (length - x);
      y = Math.floor( r * factor + (x + 1) * (1 - factor) );
    }
    
    // swap array elements
    [array[x], array[y]] = [array[y], array[x]];
  }

  Logger.log(factor + ': '+ array)

}
