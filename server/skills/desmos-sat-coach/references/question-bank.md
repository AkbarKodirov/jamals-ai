# Desmos SAT Coach question bank

Original hard questions in Digital SAT style. Answers verified with sympy. Do not show the answer, hints or Desmos steps until the student asks or answers.

## Algebra

### ALG-01 · Systems: infinitely many solutions (hard)

In the system below, k and c are constants.  
  kx + 3y = 9  
  4x + 6y = c  
If the system has infinitely many solutions, what is the value of k + c?

- **Answer:** 20
- **Hint 1:** Type both equations into Desmos exactly as written. Desmos will offer sliders for k and c.
- **Hint 2:** Infinitely many solutions means the two lines sit exactly on top of each other. Make them parallel first (k), then slide c until they merge.
- **Desmos:** kx + 3y = 9   (add slider for k) | 4x + 6y = c   (add slider for c) | Move k until the lines are parallel: k = 2. | Move c until the lines overlap completely: c = 18.
- **Look for:** One single line on screen (the two graphs coincide).
- **Why:** The second equation must be exactly 2 times the first: 2k = 4 gives k = 2, and 2(9) = c gives c = 18, so k + c = 20.
- **Trap:** Stopping at parallel lines (that is NO solution). They must coincide.
- **Next time:** Infinite solutions = same line. Slide slope to match, then slide intercept to match.

### ALG-02 · Systems: no solution (hard)

In the system below, a is a constant.  
  y = (a - 2)x + 5  
  3x - 2y = 8  
For what value of a does the system have no solution?

- **Answer:** 3.5
- **Hint 1:** Graph both equations. Put a slider on a.
- **Hint 2:** No solution means parallel lines that never touch. Slide a until the lines are parallel.
- **Desmos:** y = (a - 2)x + 5   (slider for a) | 3x - 2y = 8 | Slide a until the lines are parallel. Set the slider step to 0.5 to land exactly: a = 3.5.
- **Look for:** Two parallel lines with different y-intercepts (5 and -4).
- **Why:** 3x - 2y = 8 is y = 1.5x - 4, slope 1.5. Parallel needs a - 2 = 1.5, so a = 3.5 (7/2). Intercepts 5 and -4 differ, so no solution.
- **Trap:** Check intercepts differ; if they matched you would get infinitely many solutions instead.
- **Next time:** No solution = same slope, different intercept.

### ALG-03 · Linear equation: infinitely many solutions (hard)

In the equation 3(kx - 2) - 2(x + 4) = 7x + c, k and c are constants. If the equation has infinitely many solutions, what is the value of k + c?

- **Answer:** -11
- **Hint 1:** Graph the left side as y = 3(kx - 2) - 2(x + 4) and the right side as y = 7x + c, with sliders.
- **Hint 2:** Infinitely many solutions means the two graphs are the same line.
- **Desmos:** y = 3(kx - 2) - 2(x + 4) | y = 7x + c | Slide k until the lines are parallel: k = 3. | Slide c until they overlap: c = -14.
- **Look for:** The two lines coincide.
- **Why:** Left side = (3k - 2)x - 14. Matching 7x + c needs 3k - 2 = 7 (k = 3) and c = -14. So k + c = -11.
- **Trap:** Forgetting to distribute the -2 to the +4 gives the wrong constant.
- **Next time:** An equation in x with infinitely many solutions: graph both sides; they must be identical.

### ALG-04 · Linear inequalities: optimization (hard)

The point (x, y) satisfies all of the inequalities x + y <= 10, 2x + y <= 14, x >= 0, and y >= 0. What is the maximum possible value of 3x + 2y?

- **Answer:** 24
- **Hint 1:** Graph all four inequalities. The overlapping (darkest) region is where (x, y) can be.
- **Hint 2:** Graph 3x + 2y = m with a slider for m and push the line outward until it last touches the region.
- **Desmos:** x + y <= 10 | 2x + y <= 14 | x >= 0 | y >= 0 | 3x + 2y = m   (slider for m, range 0 to 40) | Increase m until the line only just touches the shaded region: it leaves at the corner (4, 6) when m = 24.
- **Look for:** The last corner of the overlap region the moving line touches. Click the corners to read them: (0,0), (7,0), (4,6), (0,10).
- **Why:** The maximum of a linear expression over a polygon happens at a corner. 3x + 2y gives 0, 21, 24, 20 at the corners; the largest is 24 at (4, 6).
- **Trap:** Picking the corner with the biggest y (0, 10) gives only 20.
- **Next time:** Max/min of ax + by over a region: test the corners, or slide the line ax + by = m.

### ALG-05 · Slope with unknown coordinate (hard)

A line passes through the points (2, k) and (k, 8). If the slope of the line is 3, what is the value of k?

- **Answer:** 3.5
- **Hint 1:** Write the slope as a function of k, then use x in place of k so Desmos can graph it.
- **Hint 2:** Graph y = (8 - x)/(x - 2) and y = 3 and find where they meet.
- **Desmos:** y = (8 - x)/(x - 2)   (this is the slope when k = x) | y = 3 | Click the intersection: (3.5, 3).
- **Look for:** The intersection's x-coordinate is k.
- **Why:** (8 - k)/(k - 2) = 3 gives 8 - k = 3k - 6, so 4k = 14 and k = 3.5.
- **Trap:** Writing the slope upside down, (k - 2)/(8 - k).
- **Next time:** 'Find the constant' questions: rename the constant x, graph the condition, read the intersection.

### ALG-06 · Absolute value inequality, counting integers (hard)

How many integer values of x satisfy |2x - 7| <= 9?

- **Answer:** 10
- **Hint 1:** Type the inequality directly into Desmos. It shades the x-values that work.
- **Hint 2:** Read the left and right edges of the shaded band, then count integers inside, including the ends.
- **Desmos:** |2x - 7| <= 9 | The shaded vertical band runs from x = -1 to x = 8 (solid edges, so both ends count).
- **Look for:** The band edges at x = -1 and x = 8.
- **Why:** -9 <= 2x - 7 <= 9 gives -1 <= x <= 8. Integers -1 through 8: that is 10 values.
- **Trap:** Counting 8 - (-1) = 9 and forgetting to add 1 for inclusive ends.
- **Next time:** Counting integers from m to n inclusive: n - m + 1.

### ALG-07 · Linear model, break-even (hard)

Plan A costs $c per month plus $0.15 per text. Plan B costs $20 per month plus $0.10 per text. The plans cost the same for 300 texts in a month. Which plan is cheaper for 500 texts, and by how many dollars? Give the dollar difference.

- **Answer:** 10
- **Hint 1:** First find c: graph y = c + 0.15x and y = 20 + 0.10x with a slider on c, and make them meet at x = 300.
- **Hint 2:** Then look at x = 500 (draw the line x = 500) and compare the two y-values.
- **Desmos:** y = c + 0.15x   (slider for c) | y = 20 + 0.10x | x = 300 | Slide c until the intersection is on x = 300: c = 5. | x = 500  then click where it crosses each line: A = 80, B = 70.
- **Look for:** The y-values of each plan on the vertical line x = 500.
- **Why:** c + 45 = 50 gives c = 5. At 500 texts, A costs 5 + 75 = 80 and B costs 20 + 50 = 70. B is cheaper by $10.
- **Trap:** Answering the break-even point (300) instead of the difference at 500.
- **Next time:** Comparing two plans: graph both, use a vertical line at the given amount.

### ALG-08 · System of equations, word problem (hard)

A theater sold 410 tickets for a total of $4,770. Adult tickets cost $14 and student tickets cost $9. How many adult tickets were sold?

- **Answer:** 216
- **Hint 1:** Let x = adult tickets, y = student tickets. Write one equation for the count and one for the money.
- **Hint 2:** Graph x + y = 410 and 14x + 9y = 4770. Zoom out a lot; the intersection is far from the origin.
- **Desmos:** x + y = 410 | 14x + 9y = 4770 | Zoom out (or set window 0 to 500) and click the intersection: (216, 194).
- **Look for:** Intersection x-coordinate = adult tickets.
- **Why:** Substitute y = 410 - x: 14x + 9(410 - x) = 4770, so 5x = 1080 and x = 216.
- **Trap:** Reporting 194 (the student tickets).
- **Next time:** Big-number systems: graph them, then use the zoom-fit button so the intersection is visible.

### ALG-09 · Linear model: day 1 is not x = 0 (hard)

A climbing gym charges a one-time sign-up fee plus the same fee every month. By the end of the 1st month a member has paid $85 in total. By the end of the 6th month the member has paid $310 in total. How many dollars is the sign-up fee?

- **Answer:** 40
- **Hint 1:** Turn the two facts into two points (months, total paid) and let Desmos find the line.
- **Hint 2:** The sign-up fee is what the line gives at 0 months, not at 1 month.
- **Desmos:** Table: x1 = 1, 6 and y1 = 85, 310 | y1 ~ m x1 + b   (regression gives m = 45, b = 40) | Or click where the line crosses the y-axis: (0, 40).
- **Look for:** The y-intercept of the fitted line.
- **Why:** Monthly fee = (310 - 85)/(6 - 1) = 45. Total after 1 month = fee + 45 = 85, so the fee is 40.
- **Trap:** Answering 85. The first month already includes one monthly payment, so month 1 is the point x = 1, not the intercept.
- **Next time:** Before using a number as the starting value, ask what x it belongs to. 'After the first ...' is x = 1.

### ALG-10 · Two-rate pay (overtime) (hard)

A courier is paid $18 per hour for the first 35 hours worked in a week and 1.5 times that rate for every hour after 35. Last week the courier earned $819. How many hours did the courier work in total?

- **Answer:** 42
- **Hint 1:** First find what the courier earns for the full 35 regular hours.
- **Hint 2:** The money left over was all paid at the higher rate. Graph the pay as a piecewise function to check.
- **Desmos:** P(x) = {x <= 35: 18x, 630 + 27(x - 35)} | y = 819 | Click the intersection: (42, 819).
- **Look for:** Where the pay graph reaches 819.
- **Why:** 35 x 18 = 630. The rest, 819 - 630 = 189, was paid at 27 per hour: 189/27 = 7 extra hours. Total 35 + 7 = 42.
- **Trap:** Answering 7 (only the overtime hours) or dividing 819 by 18.
- **Next time:** Two-rate problems: fill the first rate completely, divide the rest by the second rate, then re-read whether they want extra or total.

### ALG-11 · Cheaper option: round the crossing the right way (hard)

Print shop A charges a $45 setup fee plus $0.18 per page. Print shop B charges $0.27 per page with no setup fee. What is the least whole number of pages for which shop A costs less than shop B?

- **Answer:** 501
- **Hint 1:** Graph both cost lines and find where they cross.
- **Hint 2:** At the crossing the costs are equal, not 'less'. Test the whole numbers next to it.
- **Desmos:** y = 45 + 0.18x | y = 0.27x | Intersection: (500, 135). | Check x = 501: 45 + 0.18(501) = 135.18 and 0.27(501) = 135.27, so A is cheaper.
- **Look for:** The crossing point, then the first whole number past it where A's line is below B's.
- **Why:** 45 + 0.18p < 0.27p gives 45 < 0.09p, so p > 500. The least whole number is 501.
- **Trap:** Answering 500. At 500 pages they cost exactly the same.
- **Next time:** Find the crossing on the graph, then round in the direction the inequality points and test both neighbours.

### ALG-12 · Interpret a constant after a shift (hard)

A water tank is being drained. The amount of water, in liters, h hours after noon is modeled by L(h) = 1200 - 85(h - 2) for 2 <= h <= 16. Which is the best interpretation of 1200 in this model?

- A) The amount of water in the tank at noon
- B) The amount of water in the tank at 2:00 p.m.
- C) The number of liters drained each hour
- D) The amount of water drained between noon and 2:00 p.m.

- **Answer:** B
- **Hint 1:** Find the value of h that makes the 85(h - 2) part disappear.
- **Hint 2:** Graph L and click the point where the output is 1200.
- **Desmos:** L(x) = 1200 - 85(x - 2) {2 <= x <= 16}   (use x for h so Desmos graphs it) | L(2) gives 1200. | Note the graph does not even exist at h = 0.
- **Look for:** The input that gives exactly 1200.
- **Why:** 1200 is the output when h - 2 = 0, so h = 2, which is 2 hours after noon.
- **Trap:** A: assuming every constant is the value at time 0.
- **Next time:** To interpret a constant, find the input that makes all the other terms zero.

### ALG-13 · f(kx) with an unknown multiplier (hard)

The function f is defined by f(x) = 6x + 5. The function g is defined by g(x) = f(kx) - f(x), where k is a constant. If g(10) = 45, what is the value of k?

- **Answer:** 1.75
- **Hint 1:** Type f, then type g exactly as defined. Put a slider on k.
- **Hint 2:** Type g(10) and slide k until it shows 45, or solve g(10) = 45 as one equation.
- **Desmos:** f(x) = 6x + 5 | g(x) = f(kx) - f(x) | g(10) ~ 45   (or slide k until g(10) = 45) | k = 1.75
- **Look for:** The k value where g(10) reads 45.
- **Why:** f(10k) - f(10) = (60k + 5) - 65 = 60k - 60. Setting 60k - 60 = 45 gives k = 105/60 = 1.75.
- **Trap:** Forgetting that f(x) is subtracted, which leads to 60k + 5 = 45.
- **Next time:** Let Desmos build compositions for you: define f once and reuse it.

### ALG-14 · Greatest whole number with tax (hard)

A robotics club has $640 to spend. Each kit costs $37 plus 8% sales tax, and the club pays a single $25 shipping charge that is not taxed. What is the greatest number of kits the club can buy?

- **Answer:** 15
- **Hint 1:** Write the total cost of x kits: tax multiplies the kit price by 1.08.
- **Hint 2:** Graph the cost and the line y = 640. Round the crossing DOWN, since the club cannot go over budget.
- **Desmos:** y = 37(1.08)x + 25 | y = 640 | Intersection at x = 15.39... | Check: x = 15 costs 624.40; x = 16 costs 664.36.
- **Look for:** The last whole number before the cost line rises above 640.
- **Why:** 39.96x + 25 <= 640 gives x <= 15.39. The greatest whole number is 15.
- **Trap:** Forgetting the tax gives 16. Rounding 15.39 up also gives 16.
- **Next time:** 'Greatest number of items' means round down; 'least number' means round up. Always test the neighbours.

### ALG-15 · Standard form, two unknown coefficients (hard)

The graph of ax + by = 36, where a and b are constants, passes through the points (3, 8) and (6, 4). What is the value of a + b?

- **Answer:** 7
- **Hint 1:** Plug each point in. Each gives one equation in a and b.
- **Hint 2:** In Desmos, rename a and b to x and y and graph both equations; they meet at (a, b).
- **Desmos:** 3x + 8y = 36   (this is the first point, with a as x and b as y) | 6x + 4y = 36 | Intersection: (4, 3), so a = 4 and b = 3.
- **Look for:** The intersection of the two condition lines.
- **Why:** 3a + 8b = 36 and 6a + 4b = 36. Doubling the first and subtracting gives 12b = 36, b = 3, then a = 4. So a + b = 7.
- **Trap:** Plugging the point the wrong way round, (8, 3) instead of (3, 8).
- **Next time:** Two unknown constants and two facts: each fact is a line; the answer is where the lines cross.

### ALG-16 · Shift a function given by a table (hard)

For the linear function f, f(1) = 5, f(4) = 14, and f(7) = 23. The function g is defined by g(x) = f(x - 3) + 2. What is the value of g(0)?

- **Answer:** -5
- **Hint 1:** Regress the table to get f, then define g exactly as written.
- **Hint 2:** g(0) means f(-3) + 2.
- **Desmos:** Table: x1 = 1, 4, 7 and y1 = 5, 14, 23 | y1 ~ m x1 + b   (m = 3, b = 2) | f(x) = mx + b | g(x) = f(x - 3) + 2 | g(0) = -5
- **Look for:** The value Desmos prints for g(0).
- **Why:** f(x) = 3x + 2. g(0) = f(-3) + 2 = -9 + 2 + 2 = -5.
- **Trap:** Shifting the wrong way and computing f(3) + 2 = 13.
- **Next time:** Never shift by hand. Define f from the table, define g from f, and evaluate.

### ALG-17 · Percent chain solved as one list regression (hard)

The number u is 120% of the number v, and v is 45% of the positive number w. If u is k% of w, what is the value of k?

- **Answer:** 54
- **Hint 1:** Every fact is one equation. Put the left sides in one list and the right sides in another.
- **Hint 2:** Type [u, v, k% of w] ~ [120% of v, 45% of w, u]. Desmos sets the free number w to 1, which is fine for a ratio.
- **Desmos:** [u, v, k% of w] ~ [120% of v, 45% of w, u] | Regression panel: u = 0.54, v = 0.45, k = 54
- **Look for:** k in the regression panel.
- **Why:** u = 1.2(0.45w) = 0.54w, so u is 54% of w.
- **Trap:** Adding the percents (165) or multiplying 120 by 45 without converting to decimals.
- **Next time:** A chain of 'is __% of' facts: one list ~ one list, with Desmos's 'of' syntax. The unknown percent drops out of the regression.

### ALG-18 · Answer in terms of one quantity: let the free unknown be 1 (very hard)

The speed of runner A is 250% of the speed of runner B, and the speed of runner B is 0.8% of the speed of car C. Which expression gives the sum of the speeds of runner A and car C in terms of B, the speed of runner B?

- A) 2.58B
- B) 27.5B
- C) 127.5B
- D) 1250B

- **Answer:** C
- **Hint 1:** Write each fact with 'of': A = 250% of B, B = 0.8% of C. The question wants A + C = kB.
- **Hint 2:** Type [A, B, A + C] ~ [250% of B, 0.8% of C, kB] and read k.
- **Desmos:** [A, B, A + C] ~ [250% of B, 0.8% of C, k B] | Regression panel: k = 127.5
- **Look for:** k. The other numbers depend on the free speed Desmos picked; k does not.
- **Why:** A = 2.5B and C = B/0.008 = 125B, so A + C = 127.5B.
- **Trap:** Reading 0.8% as 0.8 (answer A) or multiplying instead of dividing to get C.
- **Next time:** 'In terms of X' means a ratio. Add 'kX' to the list and let Desmos find k.

## Advanced Math

### ADV-01 · Quadratic: exactly one solution (discriminant) (very hard)

In the equation x^2 - kx + 2k - 3 = 0, k is a constant. The equation has exactly one real solution. What is the greatest possible value of k?

- **Answer:** 6
- **Hint 1:** Graph y = x^2 - kx + 2k - 3 with a slider on k. One real solution means the parabola just touches the x-axis.
- **Hint 2:** Faster: the discriminant k^2 - 4(2k - 3) must equal 0. Graph it with x in place of k and read the zeros.
- **Desmos:** Method 1: y = x^2 - kx + 2k - 3  (slider k from -10 to 10) and slide until the vertex sits on the x-axis. That happens at k = 2 and k = 6. | Method 2 (faster): y = x^2 - 4(2x - 3)  (the discriminant with k renamed x). Click the x-intercepts: x = 2 and x = 6.
- **Look for:** Where the discriminant graph crosses zero.
- **Why:** b^2 - 4ac = k^2 - 8k + 12 = (k - 2)(k - 6) = 0, so k = 2 or 6. The greatest is 6.
- **Trap:** Stopping at the first value you find (2).
- **Next time:** 'Exactly one solution' for a quadratic: discriminant = 0. Graph the discriminant as a function of the constant.

### ADV-02 · Line tangent to parabola (very hard)

The line y = 2x + b intersects the parabola y = x^2 - 4x + 7 at exactly one point. What is the value of b?

- **Answer:** -2
- **Hint 1:** Graph the parabola and the line with a slider on b.
- **Hint 2:** Slide b until the line just touches (is tangent to) the parabola.
- **Desmos:** y = x^2 - 4x + 7 | y = 2x + b  (slider for b) | Slide b until there is exactly one intersection: b = -2, touching at (3, 4).
- **Look for:** The single touching point (3, 4).
- **Why:** x^2 - 4x + 7 = 2x + b gives x^2 - 6x + (7 - b) = 0. One solution: 36 - 4(7 - b) = 0, so b = -2.
- **Trap:** A slider step of 1 might jump over the exact value; set step 0.1 or confirm with the discriminant.
- **Next time:** Tangent line + parabola: slide the intercept until one intersection, or set discriminant to 0.

### ADV-03 · Absolute value equation, sum of solutions (hard)

What is the sum of all solutions to (x - 3)^2 = |2x - 6|?

- **Answer:** 9
- **Hint 1:** Graph each side as its own function.
- **Hint 2:** Count every intersection, including the one where both graphs touch the x-axis.
- **Desmos:** y = (x - 3)^2 | y = |2x - 6| | Click each intersection: (1, 4), (3, 0), (5, 4).
- **Look for:** Three intersections; add their x-values.
- **Why:** Let u = x - 3: u^2 = 2|u| gives u = 0 or |u| = 2, so x = 3, 1, 5. Sum = 9.
- **Trap:** Missing x = 3 because the graphs touch at the bottom.
- **Next time:** Equation with absolute value: graph both sides, count every intersection.

### ADV-04 · Rational equation with extraneous root (hard)

What value of x satisfies x/(x - 2) + 3/(x + 1) = 6/((x - 2)(x + 1))?

- **Answer:** -6
- **Hint 1:** Graph the left side and the right side as two separate functions.
- **Hint 2:** Algebra gives two candidates, but one of them makes a denominator zero. Desmos only shows real intersections.
- **Desmos:** y = x/(x - 2) + 3/(x + 1) | y = 6/((x - 2)(x + 1)) | Click the only intersection: (-6, 0.15).
- **Look for:** Only one intersection; nothing at x = 2 (both graphs are undefined there).
- **Why:** Clearing denominators gives x^2 + 4x - 12 = 0, so x = -6 or x = 2. x = 2 makes a denominator zero, so it is extraneous. Answer -6.
- **Trap:** Reporting x = 2, the extraneous root.
- **Next time:** Desmos never shows extraneous roots. If algebra gives more answers than the graph, trust the graph.

### ADV-05 · Radical equation with extraneous root (hard)

What is the solution to sqrt(2x + 11) = x - 2?

- **Answer:** 7
- **Hint 1:** Graph y = sqrt(2x + 11) and y = x - 2.
- **Hint 2:** Read every intersection; there is only one.
- **Desmos:** y = sqrt(2x + 11) | y = x - 2 | Click the intersection: (7, 5).
- **Look for:** One intersection at x = 7.
- **Why:** Squaring: 2x + 11 = x^2 - 4x + 4, so x^2 - 6x - 7 = 0 and x = 7 or -1. At x = -1 the right side is -3 but a square root cannot be negative, so -1 is extraneous.
- **Trap:** Choosing -1 from the squared equation.
- **Next time:** Square-root equations: graph both sides; extraneous roots vanish.

### ADV-06 · Projectile vertex (hard)

The height of a ball, in meters, t seconds after it is thrown is h(t) = -4.9t^2 + 29.4t + 2. What is the maximum height of the ball, in meters?

- **Answer:** 46.1
- **Hint 1:** Graph y = -4.9x^2 + 29.4x + 2 (use x for t).
- **Hint 2:** Click the top of the parabola; Desmos marks the maximum.
- **Desmos:** y = -4.9x^2 + 29.4x + 2 | Zoom fit, then click the vertex: (3, 46.1).
- **Look for:** The y-coordinate of the vertex.
- **Why:** Vertex at t = -29.4 / (2(-4.9)) = 3. h(3) = -44.1 + 88.2 + 2 = 46.1.
- **Trap:** Answering 3 (the time) instead of the height.
- **Next time:** Max/min of a quadratic: graph it and click the vertex. Answer the coordinate the question asks for.

### ADV-07 · Equivalent exponential form (hard)

The function f(x) = 5000(1.21)^(x/2) models a value x years from now. Which equivalent form shows the yearly growth factor as the base?

- A) f(x) = 5000(1.1)^x
- B) f(x) = 5000(1.21)^x
- C) f(x) = 5000(1.105)^x
- D) f(x) = 5000(2.42)^x

- **Answer:** A
- **Hint 1:** Graph the original and each choice.
- **Hint 2:** The right choice lies exactly on top of the original everywhere.
- **Desmos:** f(x) = 5000(1.21)^(x/2) | g(x) = 5000(1.1)^x | h(x) = 5000(1.105)^x | Only g overlaps f. Check by typing f(10) and g(10): both 12968.71.
- **Look for:** Complete overlap of graphs, or equal values in a table.
- **Why:** (1.21)^(x/2) = ((1.21)^(1/2))^x = 1.1^x. The yearly growth is 10%.
- **Trap:** Halving 1.21 to 1.105 (C) or doubling (D).
- **Next time:** Equivalent forms: graph both and check they coincide, or compare f(10) with the choice at 10.

### ADV-08 · Polynomial identity, find constants (hard)

If (ax + 3)(2x - b) = 6x^2 - 6x - 12 for all values of x, where a and b are constants, what is a + b?

- **Answer:** 7
- **Hint 1:** Graph y = (ax + 3)(2x - b) with sliders and y = 6x^2 - 6x - 12.
- **Hint 2:** Adjust the sliders until the two parabolas coincide.
- **Desmos:** y = (ax + 3)(2x - b)  (sliders a, b) | y = 6x^2 - 6x - 12 | Slide a to 3 (the parabolas get the same width) and b to 4 (they coincide).
- **Look for:** The two parabolas become one.
- **Why:** Leading term: 2a = 6 so a = 3. Constant: -3b = -12 so b = 4. Check middle: -ab + 6 = -12 + 6 = -6. So a + b = 7.
- **Trap:** Matching only one coefficient without checking the middle term.
- **Next time:** 'For all values of x' means identical graphs.

### ADV-09 · Factor theorem (hard)

p(x) = 2x^3 + kx^2 - 7x + 6, where k is a constant. If x - 2 is a factor of p(x), what is the value of k?

- **Answer:** -2
- **Hint 1:** x - 2 is a factor means p(2) = 0, so the graph passes through (2, 0).
- **Hint 2:** Graph p with a slider for k and slide until it passes through (2, 0).
- **Desmos:** p(x) = 2x^3 + kx^2 - 7x + 6  (slider k) | (2, 0) | Slide k until the curve hits the point: k = -2. | Or: y = 2(2)^3 + x(2)^2 - 7(2) + 6 and read the x-intercept: -2.
- **Look for:** The graph passing through (2, 0).
- **Why:** p(2) = 16 + 4k - 14 + 6 = 4k + 8 = 0, so k = -2.
- **Trap:** Using p(-2) = 0 instead (wrong sign).
- **Next time:** Factor (x - r) means the graph crosses the x-axis at x = r.

### ADV-10 · Nonlinear system, count solutions (hard)

How many solutions does the system y = x^3 - 4x and y = x + 1 have?

- **Answer:** 3
- **Hint 1:** Graph both.
- **Hint 2:** Zoom so you can see the whole cubic between x = -3 and 3 and count crossings.
- **Desmos:** y = x^3 - 4x | y = x + 1 | There are crossings near x = -2.13, -0.20 and 2.33.
- **Look for:** Number of intersection points.
- **Why:** x^3 - 5x - 1 = 0 has three real roots (its graph crosses zero three times).
- **Trap:** A zoomed-in window can hide an intersection; zoom out before counting.
- **Next time:** 'How many solutions' = count intersections on a well-zoomed graph.

### ADV-11 · Transformations of a function (hard)

f(x) = x^2 - 4x + 1 and g(x) = f(x - 3) + 2. The vertex of the graph of g is (h, k). What is h + k?

- **Answer:** 4
- **Hint 1:** Define f in Desmos, then type g(x) = f(x - 3) + 2. Desmos handles the shift.
- **Hint 2:** Click g's vertex.
- **Desmos:** f(x) = x^2 - 4x + 1 | g(x) = f(x - 3) + 2 | Click the vertex of g: (5, -1).
- **Look for:** Vertex of g.
- **Why:** f has vertex (2, -3). Shifting right 3 and up 2 gives (5, -1). 5 + (-1) = 4.
- **Trap:** Shifting left for f(x - 3).
- **Next time:** Define the function once in Desmos, then type the transformed version with function notation.

### ADV-12 · Vertex form with conditions (hard)

f(x) = a(x - 3)^2 + k, where a and k are constants. The minimum value of f is -8 and f(5) = 4. What is f(0)?

- **Answer:** 19
- **Hint 1:** Minimum value -8 tells you k. Graph with a slider on a and the point (5, 4).
- **Hint 2:** Once the graph hits (5, 4), type f(0).
- **Desmos:** f(x) = a(x - 3)^2 - 8  (slider a) | (5, 4) | Slide a until the curve passes through (5, 4): a = 3. | f(0)  shows 19.
- **Look for:** Value of f(0) once a is set.
- **Why:** Minimum -8 means k = -8. f(5) = 4a - 8 = 4 gives a = 3. f(0) = 3(9) - 8 = 19.
- **Trap:** Using k = 8 instead of -8.
- **Next time:** Use sliders to force a graph through given points, then evaluate.

### ADV-13 · Line meets circle-like curve: count (very hard)

How many points do the graphs of y = x^2 - 6 and x^2 + y^2 = 36 have in common?

- **Answer:** 3
- **Hint 1:** Graph both.
- **Hint 2:** Look closely at the bottom of the circle; the parabola's vertex is there.
- **Desmos:** y = x^2 - 6 | x^2 + y^2 = 36 | Intersections: (0, -6), (-3.317, 5), (3.317, 5).
- **Look for:** Three intersection points, one of them a tangent touch at (0, -6).
- **Why:** Substitute x^2 = y + 6: y^2 + y - 30 = 0, so y = 5 or y = -6. y = 5 gives two x-values; y = -6 gives x = 0 only. Total 3.
- **Trap:** Saying 4 (assuming two y-values give four points) or 2 (missing the tangent point).
- **Next time:** Curve-curve systems: graph and count; zoom on tangent spots.

### ADV-14 · Composition of functions (hard)

f(x) = 2x - 3 and g(x) = x^2 + 1. If f(g(a)) = 15 and a > 0, what is the value of a? (Give an exact form or a decimal.)

- **Answer:** 2.828 (2*sqrt(2))
- **Hint 1:** Define f and g in Desmos and graph y = f(g(x)).
- **Hint 2:** Graph y = 15 and read the positive intersection.
- **Desmos:** f(x) = 2x - 3 | g(x) = x^2 + 1 | y = f(g(x)) | y = 15 | Positive intersection: x = 2.828.
- **Look for:** The intersection with x > 0.
- **Why:** 2(a^2 + 1) - 3 = 15, so a^2 = 8 and a = 2*sqrt(2) = 2.828.
- **Trap:** Computing g(f(a)) instead.
- **Next time:** Composition: define both functions, graph the composition, intersect with the target value.

### ADV-15 · Quadratic through three points (regression) (very hard)

The parabola y = ax^2 + bx + c passes through (-1, 8), (1, 2), and (3, 4). What is the value of c?

- **Answer:** 4
- **Hint 1:** Put the three points in a Desmos table (x1, y1).
- **Hint 2:** Run the regression y1 ~ a x1^2 + b x1 + c and read c.
- **Desmos:** Table: x1 = -1, 1, 3 ; y1 = 8, 2, 4 | y1 ~ a x1^2 + b x1 + c | Regression output: a = 1, b = -3, c = 4 (R^2 = 1).
- **Look for:** The value of c in the regression panel. R^2 = 1 confirms an exact fit.
- **Why:** Subtracting equations gives 2b = -6 (b = -3), then a = 1 and c = 4.
- **Trap:** Reading a + b + c (that is the y-value at x = 1, which is 2).
- **Next time:** Unknown coefficients + given points = regression. R^2 = 1 means exact.

### ADV-16 · Exponential through two points (hard)

f(x) = a*b^x, where a and b are positive constants. If f(2) = 36 and f(5) = 972, what is f(0)?

- **Answer:** 4
- **Hint 1:** Put (2, 36) and (5, 972) in a table.
- **Hint 2:** Regression: y1 ~ a b^(x1). f(0) = a.
- **Desmos:** Table: x1 = 2, 5 ; y1 = 36, 972 | y1 ~ a b^(x1) | Output: a = 4, b = 3.
- **Look for:** a, because f(0) = a*b^0 = a.
- **Why:** f(5)/f(2) = b^3 = 27, so b = 3. Then 9a = 36, a = 4.
- **Trap:** Answering b.
- **Next time:** Exponential with two points: regression with y1 ~ a b^(x1).

### ADV-17 · Roots that differ by a given amount (very hard)

The two solutions of 3x^2 + 12x + c = 0 differ by 6. What is the value of c?

- **Answer:** -15
- **Hint 1:** Graph y = 3x^2 + 12x + c with a slider on c.
- **Hint 2:** The parabola is symmetric about x = -2, so the roots must be -2 - 3 and -2 + 3.
- **Desmos:** y = 3x^2 + 12x + c  (slider c) | (-5, 0) | (1, 0) | Slide c until the parabola passes through both points: c = -15.
- **Look for:** x-intercepts at -5 and 1.
- **Why:** Axis of symmetry x = -2. Roots -5 and 1. Product of roots = c/3 = -5, so c = -15.
- **Trap:** Putting the roots at 0 and 6 (ignoring symmetry).
- **Next time:** Roots are symmetric about the vertex x = -b/(2a).

### ADV-18 · Line-parabola system, sum of y-values (hard)

The graphs of y = 2x^2 - 5x + 1 and y = x + 9 intersect at two points. What is the sum of the y-coordinates of those points?

- **Answer:** 21
- **Hint 1:** Graph both.
- **Hint 2:** Click both intersections and add the y-values.
- **Desmos:** y = 2x^2 - 5x + 1 | y = x + 9 | Intersections: (-1, 8) and (4, 13).
- **Look for:** The y-coordinates, not x.
- **Why:** 2x^2 - 6x - 8 = 0, x^2 - 3x - 4 = 0, x = 4 or -1. y = 13 and 8. Sum 21.
- **Trap:** Adding x-values (3).
- **Next time:** Read the coordinate the question asks for.

### ADV-19 · Exponential decay, solve for time (hard)

The mass of a sample, in grams, after t hours is m(t) = 800(1/2)^(t/6). After how many hours is the mass 50 grams?

- **Answer:** 24
- **Hint 1:** Graph y = 800(1/2)^(x/6) and y = 50.
- **Hint 2:** Zoom out horizontally to about x = 40 to find the intersection.
- **Desmos:** y = 800(1/2)^(x/6) | y = 50 | Intersection: (24, 50).
- **Look for:** The x-value where the curve reaches 50.
- **Why:** 800 / 50 = 16 = 2^4, so t/6 = 4 and t = 24.
- **Trap:** Dividing 800 by 50 and answering 16.
- **Next time:** Exponential 'when does it reach': graph and intersect with a horizontal line.

### ADV-20 · Exponential overtakes linear (very hard)

f(x) = 100(1.08)^x and g(x) = 100 + 12x. What is the smallest positive integer x for which f(x) > g(x)?

- **Answer:** 11
- **Hint 1:** Graph both and find where the curve passes the line (not at x = 0).
- **Hint 2:** Check integer values on each side with a table.
- **Desmos:** f(x) = 100(1.08)^x | g(x) = 100 + 12x | Intersection near x = 10.8. | Table with x = 10, 11: f(10) = 215.89 < g(10) = 220; f(11) = 233.16 > g(11) = 232.
- **Look for:** Second intersection at about x = 10.8, then the next integer.
- **Why:** The curves cross at about 10.8. The first integer after that is 11, and the table confirms f(11) > g(11).
- **Trap:** Rounding 10.8 down to 10.
- **Next time:** 'Smallest integer such that': find the crossing, then check integers on both sides in a table.

### ADV-21 · Intercept condition with shifted vertex (hard)

f(x) = -2(x - h)^2 + 18, where h > 1. The graph of f crosses the x-axis at x = 1. At what other x-value does it cross the x-axis?

- **Answer:** 7
- **Hint 1:** Graph f with a slider on h and plot (1, 0).
- **Hint 2:** Slide h (above 1) until the curve passes through (1, 0), then read the other intercept.
- **Desmos:** f(x) = -2(x - h)^2 + 18  (slider h, from 1 to 10) | (1, 0) | h = 4 puts the curve through (1, 0). Other intercept: (7, 0).
- **Look for:** The second x-intercept.
- **Why:** -2(1 - h)^2 + 18 = 0 gives (h - 1)^2 = 9, h = 4. Intercepts are 4 ± 3, so 1 and 7.
- **Trap:** Answering h = 4.
- **Next time:** Use symmetry: intercepts are equally spaced around the vertex.

### ADV-22 · Exactly three solutions with a parameter (very hard)

For what value of c does the equation x^2 + 6x + c = 2|x + 3| have exactly three real solutions?

- **Answer:** 9
- **Hint 1:** Graph y = x^2 + 6x + c (slider c) and y = 2|x + 3|.
- **Hint 2:** Three intersections happen when the parabola passes through the corner of the V.
- **Desmos:** y = x^2 + 6x + c  (slider c) | y = 2|x + 3| | Slide c and count intersections. At c = 9 the parabola goes through the corner (-3, 0) and crosses each arm once more: 3 points.
- **Look for:** The value of c giving exactly three intersections.
- **Why:** Let u = x + 3: u^2 - 2|u| + (c - 9) = 0 is symmetric in u, so solutions come in ± pairs unless u = 0 is a solution. u = 0 needs c = 9, then u = 0, ±2: three solutions.
- **Trap:** Making the parabola tangent to an arm (that gives 2 or 4, not 3).
- **Next time:** Odd number of solutions to a symmetric equation means the center point must be a solution.

### ADV-23 · Nonzero parameter, exactly one solution (very hard)

The system y = ax^2 + 4x + 1 and y = 2x - 3 has exactly one solution, where a is a nonzero constant. What is the value of a?

- **Answer:** 0.25
- **Hint 1:** Graph both with a slider on a (step 0.01).
- **Hint 2:** Slide a until the parabola just touches the line.
- **Desmos:** y = ax^2 + 4x + 1  (slider a, step 0.01) | y = 2x - 3 | At a = 0.25 the parabola touches the line once, at (-4, -11).
- **Look for:** A single tangent point.
- **Why:** ax^2 + 2x + 4 = 0 has one solution when 4 - 16a = 0, so a = 1/4.
- **Trap:** a = 0 also gives one solution, but the question says nonzero.
- **Next time:** Tangent = discriminant zero. Watch for the a = 0 special case.

### ADV-24 · Vertex location from factored form (hard)

f(x) = (x - k)(x + 5), where k is a constant. The minimum of f occurs at x = -1. What is the value of k?

- **Answer:** 3
- **Hint 1:** Graph f with a slider on k.
- **Hint 2:** Slide k until the vertex is at x = -1 (graph x = -1 to help).
- **Desmos:** f(x) = (x - k)(x + 5)  (slider k) | x = -1 | Slide k until the vertex sits on x = -1: k = 3.
- **Look for:** Vertex on the line x = -1.
- **Why:** The vertex is halfway between the roots k and -5: (k - 5)/2 = -1, so k = 3.
- **Trap:** Setting k = -1.
- **Next time:** Vertex x = midpoint of the roots.

### ADV-25 · Count integer parameters, no real solutions (very hard)

For how many integer values of k does x^2 + kx + 9 = 0 have no real solutions?

- **Answer:** 11
- **Hint 1:** No real solutions means discriminant < 0.
- **Hint 2:** Graph y = x^2 - 36 (discriminant with k renamed x) and see where it is below zero.
- **Desmos:** y = x^2 - 36  (discriminant k^2 - 36 with x in place of k) | Below the x-axis between x = -6 and 6 (not including them).
- **Look for:** Open interval -6 < k < 6.
- **Why:** k^2 - 36 < 0 means -6 < k < 6: integers -5 through 5, which is 11 values.
- **Trap:** Including ±6 (those give exactly one solution).
- **Next time:** Graph the discriminant as a function of the constant.

### ADV-26 · Minimize with a constraint (hard)

If x + y = 10, what is the minimum possible value of x^2 + y^2?

- **Answer:** 50
- **Hint 1:** Replace y with 10 - x so there is one variable.
- **Hint 2:** Graph y = x^2 + (10 - x)^2 and click the vertex.
- **Desmos:** y = x^2 + (10 - x)^2 | Vertex: (5, 50).
- **Look for:** Minimum y-value.
- **Why:** 2x^2 - 20x + 100 has vertex at x = 5, value 50.
- **Trap:** Answering 5.
- **Next time:** Constraint questions: substitute to one variable, then graph and read the vertex.

### ADV-27 · Equivalent forms of a quadratic (hard)

f(x) = x^2 - 8x + 7. Which equivalent form shows the minimum value of f as a constant or coefficient?

- A) f(x) = (x - 1)(x - 7)
- B) f(x) = (x - 4)^2 - 9
- C) f(x) = x(x - 8) + 7
- D) f(x) = (x - 4)^2 + 7

- **Answer:** B
- **Hint 1:** Graph f and every choice; discard any that do not overlap f.
- **Hint 2:** Of those that overlap, which shows the vertex y-value -9?
- **Desmos:** f(x) = x^2 - 8x + 7 | Graph each choice. D does not overlap. The vertex of f is (4, -9). | Only B displays -9.
- **Look for:** Overlap, then which form contains the vertex value.
- **Why:** Completing the square: (x - 4)^2 - 16 + 7 = (x - 4)^2 - 9. Minimum value -9 appears in B.
- **Trap:** A is equivalent but shows the zeros, not the minimum.
- **Next time:** Vertex form shows min/max; factored form shows zeros; standard form shows y-intercept.

### ADV-28 · Identity with positive integer constants (very hard)

(ax + b)(x + c) = 3x^2 + 23x + 14 for all values of x, where a, b, and c are positive integers. What is the value of a + b + c?

- **Answer:** 12
- **Hint 1:** Type it as a regression: make a list of x values and fit a, b, c.
- **Hint 2:** Desmos may hand you a non-integer solution first. Add a restriction or try integer values of c until all three are positive integers.
- **Desmos:** x1 = [1, 2, 3, 4, 5] | (a x1 + b)(x1 + c) ~ 3x1^2 + 23x1 + 14 | If Desmos returns c = 2/3, b = 21 (not integers), set c to whole numbers yourself: c = 7 gives a = 3, b = 2. | Overlay y = (3x + 2)(x + 7) and y = 3x^2 + 23x + 14 to confirm they match.
- **Look for:** A set of constants that are all positive integers AND makes the two graphs coincide.
- **Why:** Since the constant term is bc = 14 and the leading coefficient is a = 3, try the factor pairs: (3x + 2)(x + 7) = 3x^2 + 23x + 14. So a + b + c = 3 + 2 + 7 = 12.
- **Trap:** Accepting the first regression output. (3x + 21)(x + 2/3) is also equal, but 2/3 is not an integer.
- **Next time:** When the constants must be integers, check the regression's answer against the condition and steer it (restrictions or trying integers).

### ADV-29 · Greatest and least solutions of a cubic (hard)

What is the difference between the greatest solution and the least solution of 2x^3 - 3x^2 - 11x + 6 = 0?

- **Answer:** 5
- **Hint 1:** Graph y = 2x^3 - 3x^2 - 11x + 6 and click every x-intercept.
- **Hint 2:** There are three. Use only the biggest and the smallest.
- **Desmos:** y = 2x^3 - 3x^2 - 11x + 6 | x-intercepts: (-2, 0), (0.5, 0), (3, 0) | 3 - (-2) = 5
- **Look for:** All three places the curve crosses the x-axis.
- **Why:** 2x^3 - 3x^2 - 11x + 6 = (x - 3)(2x - 1)(x + 2). The solutions are -2, 1/2, and 3, so 3 - (-2) = 5.
- **Trap:** Using the middle root 1/2 (giving 2.5 or 3.5), or missing the negative root because the window is too small.
- **Next time:** 'Greatest solution' questions: graph, click every intercept, zoom out to be sure none are hidden.

### ADV-30 · 'p% more than the previous' growth (hard)

At the end of each week, the number of bacteria colonies on a test plate was 60% more than at the end of the previous week. At the end of week 3, there were 2,048 colonies. How many colonies were there at the start (week 0)?

- **Answer:** 500
- **Hint 1:** 60% more than the previous means multiply by 1 + 0.60 = 1.6 each week.
- **Hint 2:** Write N(t) = a(1.6)^t and use the point (3, 2048) to find a.
- **Desmos:** N(t) = a(1.6)^t   (slider for a) | N(3) ~ 2048   (or slide a until N(3) = 2048) | a = 500
- **Look for:** The value of a that makes N(3) equal 2048.
- **Why:** a(1.6)^3 = 2048, so a = 2048/4.096 = 500.
- **Trap:** Using 0.6 as the factor (that would shrink the count) or dividing by 1.6 only once.
- **Next time:** 'p% more than before' = factor 1 + p/100. 'p% less' = factor 1 - p/100. 150% more is x2.5, not x1.5.

### ADV-31 · Percent change per unit of an exponential (very hard)

The function f is defined by f(x) = 400(0.64)^(x/2). For every increase of 1 in x, f(x) decreases by p%. What is the value of p?

- **Answer:** 20
- **Hint 1:** Compare two neighbouring outputs: compute f(x + 1)/f(x) for any x.
- **Hint 2:** That ratio is the part that REMAINS. The decrease is 1 minus it.
- **Desmos:** f(x) = 400(0.64)^(x/2) | f(3)/f(2)   (Desmos shows 0.8) | 1 - 0.8 = 0.2, so p = 20
- **Look for:** The ratio of consecutive outputs.
- **Why:** f(x + 1)/f(x) = (0.64)^(1/2) = 0.8. Each step keeps 80%, so it drops by 20%.
- **Trap:** Answering 36 (that is the drop for an increase of 2 in x) or 80 (the part that remains).
- **Next time:** Percent change per step: divide neighbouring outputs, then subtract from 1.

### ADV-32 · Rewrite a yearly growth model per half-year (hard)

The value of an investment t years after it was made is V(t) = 2500(1.0816)^t. Which function gives the value h half-years after it was made?

- A) W(h) = 2500(1.04)^h
- B) W(h) = 2500(1.0816)^(2h)
- C) W(h) = 2500(1.04)^(h/2)
- D) W(h) = 2500(1.0408)^h

- **Answer:** A
- **Hint 1:** Pick a number of years, say 3 years, which is 6 half-years. V(3) must equal W(6).
- **Hint 2:** Type V(3) and each choice at h = 6; keep the one that matches.
- **Desmos:** V(t) = 2500(1.0816)^t | V(3) = 3163.30 | A at h = 6: 2500(1.04)^6 = 3163.30 | B at h = 6 is far too big, C and D are too small.
- **Look for:** The choice whose value at h = 6 equals V(3).
- **Why:** h half-years is t = h/2 years. (1.0816)^(h/2) = (1.0816^(1/2))^h = 1.04^h.
- **Trap:** B uses 2h, which runs time twice as fast; D halves the growth rate instead of taking a square root.
- **Next time:** Changing time units: pick a real time, convert it to both units, and check which model gives the same value.

### ADV-33 · Remainder theorem with an unknown coefficient (hard)

The polynomial p(x) = x^3 - kx^2 + 5x - 6, where k is a constant, leaves a remainder of 4 when divided by x - 2. What is the remainder when p(x) is divided by x + 1?

- **Answer:** -14
- **Hint 1:** The remainder after dividing by x - c is just p(c).
- **Hint 2:** Use p(2) = 4 to find k, then evaluate p(-1).
- **Desmos:** p(x) = x^3 - kx^2 + 5x - 6   (slider for k) | p(2) ~ 4   (gives k = 2) | p(-1) = -14
- **Look for:** The value Desmos prints for p(-1) once k is fixed.
- **Why:** p(2) = 8 - 4k + 10 - 6 = 12 - 4k = 4, so k = 2. Then p(-1) = -1 - 2 - 5 - 6 = -14.
- **Trap:** Dividing by x + 1 means plugging in -1, not +1.
- **Next time:** Remainder when dividing by (x - c) = p(c). No long division needed.

### ADV-34 · Cubic from zeros and one point (hard)

A cubic function f has zeros at x = -1, x = 2, and x = 5, and its graph passes through (0, 20). What is the value of f(3)?

- **Answer:** -16
- **Hint 1:** The zeros give the factors. One more point fixes the stretch.
- **Hint 2:** Or put all four points in a table and regress a cubic.
- **Desmos:** Table: x1 = -1, 2, 5, 0 and y1 = 0, 0, 0, 20 | y1 ~ a(x1 + 1)(x1 - 2)(x1 - 5)   (a = 2) | f(x) = a(x + 1)(x - 2)(x - 5) | f(3) = -16
- **Look for:** The fitted a, then f(3).
- **Why:** f(x) = a(x + 1)(x - 2)(x - 5). f(0) = 10a = 20, so a = 2. f(3) = 2(4)(1)(-2) = -16.
- **Trap:** Forgetting the stretch a (using a = 1 gives -8).
- **Next time:** A zero is just a point with y = 0. Put zeros and other points in one table and regress.

### ADV-35 · Table of a shifted function (very hard)

The table gives values of g(x) = f(x) - 6, where f is a quadratic function.  
  x:    1   2   3  
  g(x): -2  3   12  
What is the y-intercept of the graph of y = f(x)? (Give the y-coordinate.)

- **Answer:** 3
- **Hint 1:** Regress a quadratic through the table. That gives g, not f.
- **Hint 2:** f(x) = g(x) + 6. Evaluate f(0).
- **Desmos:** Table: x1 = 1, 2, 3 and y1 = -2, 3, 12 | y1 ~ a x1^2 + b x1 + c   (a = 2, b = -1, c = -3) | f(x) = a x^2 + b x + c + 6 | f(0) = 3
- **Look for:** f(0), after undoing the shift.
- **Why:** g(x) = 2x^2 - x - 3, so g(0) = -3. f(0) = g(0) + 6 = 3.
- **Trap:** Reading -3 straight off the regression. That is the y-intercept of g.
- **Next time:** If the table belongs to a transformed function, fit it first, then undo the transformation before answering.

### ADV-36 · Rectangle with a 'longer than' relation (hard)

The length of a rectangular garden is 3 feet longer than twice its width. The area of the garden is 152 square feet. What is the length of the garden, in feet?

- **Answer:** 19
- **Hint 1:** Write the area using the width w only: w(2w + 3) = 152.
- **Hint 2:** Graph both sides and keep the intersection with positive x.
- **Desmos:** y = x(2x + 3) | y = 152 | Intersections at x = -9.5 and x = 8. Width must be positive: 8. | Length = 2(8) + 3 = 19
- **Look for:** The positive intersection, then convert width to length.
- **Why:** 2w^2 + 3w - 152 = 0 factors as (2w + 19)(w - 8) = 0, so w = 8 and the length is 19.
- **Trap:** Answering 8, which is the width.
- **Next time:** After solving, re-read which dimension they asked for. Use {x > 0} to hide impossible negative answers.

### ADV-37 · Sum of solutions controlled by a constant (hard)

The solutions of (x^2 - 16)(x + 2k - 1) = 0 have a sum of 11, where k is a constant. What is the value of k?

- **Answer:** -5
- **Hint 1:** Graph y = (x^2 - 16)(x + 2k - 1) with a slider for k and watch which zeros move.
- **Hint 2:** Two zeros (4 and -4) never move and cancel in the sum, so the moving zero must be 11.
- **Desmos:** y = (x^2 - 16)(x + 2k - 1)   (slider for k) | Zeros at -4 and 4 stay fixed. | Slide k until the third zero sits at x = 11: k = -5.
- **Look for:** The moving x-intercept landing at 11.
- **Why:** Solutions: 4, -4, and 1 - 2k. Sum = 1 - 2k = 11, so k = -5.
- **Trap:** Adding 4 + 4 instead of 4 + (-4).
- **Next time:** Slider on the constant: see which zeros depend on it. The fixed ones are often there to distract.

### ADV-38 · Parabola from vertex and one x-intercept (hard)

A parabola has its vertex at (3, -20) and crosses the x-axis at x = -2. At what y-value does it cross the y-axis?

- **Answer:** -12.8
- **Hint 1:** Use vertex form y = a(x - 3)^2 - 20 and find a from the intercept.
- **Hint 2:** Or remember the other x-intercept is the mirror image: 3 + 5 = 8.
- **Desmos:** y = a(x - 3)^2 - 20   (slider for a) | Slide a until the graph passes through (-2, 0): a = 0.8 | Click the y-intercept: (0, -12.8).
- **Look for:** The y-intercept after the curve is pinned through (-2, 0).
- **Why:** a(-5)^2 - 20 = 0 gives a = 0.8. At x = 0: 0.8(9) - 20 = -12.8.
- **Trap:** Answering -20 (that is the vertex) or 8 (the other x-intercept).
- **Next time:** Vertex form with one unknown: slide or regress a until the curve hits the known point, then click what is asked.

### ADV-39 · Isolate a variable in a formula (hard)

The formula T = (2m + n)/(m - p) relates the positive quantities T, m, n, and p, where m does not equal p and T does not equal 2. Which equation correctly gives m in terms of T, n, and p?

- A) m = (n + Tp)/(T - 2)
- B) m = (n - Tp)/(T - 2)
- C) m = (n + Tp)/(T + 2)
- D) m = (Tp - n)/(2 - T)

- **Answer:** A
- **Hint 1:** Pick numbers: m = 5, n = 4, p = 3. Then T = (10 + 4)/2 = 7.
- **Hint 2:** Put T = 7, n = 4, p = 3 into each choice. The right one gives m = 5.
- **Desmos:** m = 5, n = 4, p = 3   (sliders) | T = (2m + n)/(m - p)   (shows 7) | A: (n + Tp)/(T - 2) = 25/5 = 5 | B gives -17/5, C gives 25/9, D gives 17/(-5)
- **Look for:** The choice that returns your starting m.
- **Why:** T(m - p) = 2m + n, so Tm - 2m = n + Tp, so m(T - 2) = n + Tp.
- **Trap:** Sign slips when moving Tp across (B and D).
- **Next time:** Literal equations: choose distinct, non-zero numbers, compute the other variable, and test each choice.

### ADV-40 · Equivalent expression with fractional exponents (hard)

For positive numbers x and y, which expression is equivalent to (x^(3/2) y^(-1/3))^6 / (x^4 y)?

- A) x^5 / y^3
- B) x^5 / y
- C) x^(1/2) y^(-4/3)
- D) x^13 / y^3

- **Answer:** A
- **Hint 1:** Give x and y slider values, like x = 2 and y = 3. Call y something else (y1) so Desmos does not treat it as a graph.
- **Hint 2:** Compute the original as a number and compare it with each choice.
- **Desmos:** x1 = 2,  y1 = 3 | (x1^(3/2) y1^(-1/3))^6 / (x1^4 y1)   (shows 1.185...) | A: x1^5 / y1^3 = 32/27 = 1.185  (match) | Move the sliders: A still matches.
- **Look for:** The choice that keeps matching as the sliders move.
- **Why:** (x^(3/2))^6 = x^9 and (y^(-1/3))^6 = y^(-2). Dividing by x^4 y gives x^5 y^(-3).
- **Trap:** B forgets to subtract the y in the denominator; D adds exponents instead of subtracting.
- **Next time:** Equivalent expressions: plug in test values (respecting 'positive'), then move them to be sure.

### ADV-41 · Revenue maximum: price vs revenue (hard)

A theater sells 900 tickets per show when the price is $12. For every $1 increase in price, it sells 30 fewer tickets. What ticket price, in dollars, gives the greatest revenue?

- **Answer:** 21
- **Hint 1:** Revenue = price x tickets sold. Tickets sold at price x is 900 - 30(x - 12).
- **Hint 2:** Graph the revenue and click the top of the parabola. The question wants the x-coordinate.
- **Desmos:** y = x(900 - 30(x - 12)) | Click the maximum: (21, 13230).
- **Look for:** The vertex. Price is its x-coordinate; revenue is its y-coordinate.
- **Why:** R = x(1260 - 30x). The zeros are 0 and 42, so the vertex is at x = 21.
- **Trap:** Answering 13230, the maximum revenue, instead of the price.
- **Next time:** Max/min word problems: decide which coordinate is asked before clicking the vertex.

### ADV-42 · Smallest positive constant for a shared zero (very hard)

The functions f(x) = (x - k)(x - 2k) and g(x) = (x - 6)(x + 2)(x - 9) are defined for all x, where k is a constant. What is the smallest positive value of k for which the graphs of f and g share an x-intercept?

- **Answer:** 3
- **Hint 1:** Graph g once. Then graph f with a slider for k and watch f's two intercepts, k and 2k.
- **Hint 2:** Slide k up from 0 and stop the first time either intercept of f lands on 6, -2, or 9.
- **Desmos:** y = (x - 6)(x + 2)(x - 9) | y = (x - k)(x - 2k)   (slider k from 0 to 10, step 0.5) | At k = 3 the intercept 2k = 6 lands on g's intercept.
- **Look for:** The first positive k where an intercept of f sits on an intercept of g.
- **Why:** Shared intercept: k or 2k is in {6, -2, 9}. Positive options: k = 6, 9, 3, 4.5. The smallest is 3.
- **Trap:** Only checking k itself (giving 6) and forgetting the 2k intercept, or taking k = -1.
- **Next time:** Slider on the constant, then watch every intercept it controls. Honour 'positive'.

### ADV-43 · Maximum of a transformed function (hard)

The function f is defined by f(x) = -2(x - 1)^2 + 8. The function g is defined by g(x) = 3f(x + 4) - 5. What is the maximum value of g(x)?

- **Answer:** 19
- **Hint 1:** Define f, then define g from f. Do not shift by hand.
- **Hint 2:** Click the top of g. 'Maximum value' means the y-coordinate.
- **Desmos:** f(x) = -2(x - 1)^2 + 8 | g(x) = 3f(x + 4) - 5 | Click g's maximum: (-3, 19).
- **Look for:** The y-coordinate of g's peak.
- **Why:** The max of f is 8. The inside shift only moves it left; 3(8) - 5 = 19.
- **Trap:** Answering -3 (where the max happens) or 8 (the max of f).
- **Next time:** Value = y. 'Where' or 'for what x' = x.

### ADV-44 · Exponential with unknown base from a table (hard)

For the function f(x) = a(b)^x, where a and b are positive constants, f(2) = 36 and f(4) = 81. For what value of x does f(x) = 182.25?

- **Answer:** 6
- **Hint 1:** Put the two points in a table and regress y1 ~ a b^x1.
- **Hint 2:** Then graph y = 182.25 and click where it meets f.
- **Desmos:** Table: x1 = 2, 4 and y1 = 36, 81 | y1 ~ a b^(x1)   (a = 16, b = 1.5) | f(x) = a b^x | y = 182.25   intersection at x = 6
- **Look for:** The intersection's x-coordinate.
- **Why:** b^2 = 81/36 = 2.25 so b = 1.5, and a = 36/2.25 = 16. 16(1.5)^x = 182.25 gives 1.5^x = 11.390625 = 1.5^6.
- **Trap:** Assuming the outputs grow by a fixed amount each step (linear thinking).
- **Next time:** Exponential from two points: table + exponential regression, then intersect with the target.

### ADV-45 · One unknown constant from one function value (hard)

The function p is defined by p(x) = kx^2 - 3x + 7, where k is a constant. If p(4) = 39, what is the value of p(-2)?

- **Answer:** 24
- **Hint 1:** Define p with a slider for k and use p(4) = 39 to fix k.
- **Hint 2:** Type p(4) ~ 39 and Desmos solves for k.
- **Desmos:** p(x) = kx^2 - 3x + 7 | p(4) ~ 39   (k = 2.75) | p(-2) = 24
- **Look for:** p(-2) after k is fixed.
- **Why:** 16k - 12 + 7 = 39 gives k = 2.75. p(-2) = 2.75(4) + 6 + 7 = 24.
- **Trap:** Squaring -2 as -4.
- **Next time:** One unknown and one fact: let the ~ regression solve it, then evaluate.

### ADV-46 · Roots given in terms of a constant: list of roots (very hard)

The equation x^2 - 14x + c = 0, where c is a constant, has solutions k + 2√5 and k - 2√5, where k is a constant. What is the value of c?

- **Answer:** 29
- **Hint 1:** Both solutions must make the equation true. Put them in a list.
- **Hint 2:** Type x_1 = [k + 2sqrt(5), k - 2sqrt(5)] and x_1^2 - 14x_1 + c ~ 0.
- **Desmos:** x_1 = [k + 2sqrt(5), k - 2sqrt(5)] | x_1^2 - 14x_1 + c ~ 0 | Regression panel: k = 7, c = 29
- **Look for:** c in the regression panel (RMSE 0 means both roots fit).
- **Why:** The roots add to 14, so 2k = 14 and k = 7. Their product is 49 - 20 = 29 = c.
- **Trap:** Taking c = 49 (forgetting the √5 part) or c = 20.
- **Next time:** When the roots are written with an unknown, list them as x_1 and regress the equation ~ 0.

### ADV-47 · Identity for all x: list of inputs (hard)

For all values of x, (2x + a)(x - 3) + b = 2x^2 + 4x - 1, where a and b are constants. What is the value of ab?

- **Answer:** 290
- **Hint 1:** 'For all x' means any x works. Give Desmos several x values at once.
- **Hint 2:** Type x_1 = [1, 2, 3, 4, 5] and (2x_1 + a)(x_1 - 3) + b ~ 2x_1^2 + 4x_1 - 1.
- **Desmos:** x_1 = [1, 2, 3, 4, 5] | (2x_1 + a)(x_1 - 3) + b ~ 2x_1^2 + 4x_1 - 1 | Regression panel: a = 10, b = 29 | ab   (shows 290)
- **Look for:** a and b with RMSE 0, then their product.
- **Why:** Expanding gives 2x^2 + (a - 6)x - 3a + b. So a - 6 = 4 and -3a + b = -1: a = 10, b = 29.
- **Trap:** Matching only the x terms and forgetting the -3a inside the constant term.
- **Next time:** An identity is a regression on a list of x values. Use 5 inputs so every unknown is pinned.

### ADV-48 · Function on a list of inputs with a restriction (very hard)

The function f is defined by f(x) = a·b^x, where a and b are positive constants. For a constant k, f(k) = 20 and f(k + 2) = 45. What is the value of f(k + 1)?

- **Answer:** 30
- **Hint 1:** Feed f a list: f([k, k + 2]) ~ [20, 45]. Restrict a > 0 so Desmos keeps the positive branch.
- **Hint 2:** Then type f(k + 1). There are more unknowns than facts, but f(k + 1) comes out the same for every fit.
- **Desmos:** f(x) = a b^x {a > 0} | f([k, k + 2]) ~ [20, 45] | f(k + 1)   (shows 30)
- **Look for:** f(k + 1) and b = 1.5. Change the starting values if Desmos does not converge; the answer stays 30.
- **Why:** f(k + 2)/f(k) = b^2 = 45/20, so b = 1.5 and f(k + 1) = 20(1.5) = 30.
- **Trap:** Averaging 20 and 45 (32.5): exponential growth multiplies, it does not add.
- **Next time:** Several values of one function: f([inputs]) ~ [outputs]. Add {a > 0} when a sign is given.

### ADV-49 · No real solutions: read the discriminant inequality (hard)

The equation 3x^2 + bx + 12 = 0, where b is an integer, has no real solutions. What is the greatest possible value of b?

- **Answer:** 11
- **Hint 1:** No real solutions means the discriminant is negative: b^2 - 4(3)(12) < 0.
- **Hint 2:** Type it with x standing for b and read the shaded band.
- **Desmos:** x^2 - 4(3)(12) < 0 | The shading runs from x = -12 to x = 12, both dashed (not included). | Largest integer inside: 11
- **Look for:** The right edge of the shaded band and whether it is dashed.
- **Why:** b^2 < 144 gives -12 < b < 12. The greatest integer is 11.
- **Trap:** Answering 12: the edge is dashed, so 12 gives exactly one solution.
- **Next time:** Integer + inequality: graph the inequality with x as the unknown, then step inside the boundary.

### ADV-50 · Percent change per step from an exponential (hard)

The function f is defined by f(x) = 50(1.21)^(x/2). For every increase of 1 in x, f(x) increases by p%. What is the value of p?

- **Answer:** 10
- **Hint 1:** An increase of p% means multiply by (1 + p/100).
- **Hint 2:** Type f(3) ~ (1 + p/100)f(2). Any two inputs 1 apart work.
- **Desmos:** f(x) = 50(1.21)^(x/2) | f(3) ~ (1 + p/100)f(2) | Regression panel: p = 10
- **Look for:** p in the regression panel.
- **Why:** Each step of 1 multiplies by 1.21^(1/2) = 1.1, a 10% increase.
- **Trap:** Answering 21: that is the increase for a step of 2.
- **Next time:** Growth per step: compare two outputs one step apart with ~ and read p.

## Problem-Solving and Data Analysis

### PSD-01 · Linear regression prediction (hard)

The table shows data: x = 1, 2, 3, 4, 5 and y = 2.1, 3.9, 6.2, 7.8, 10.1. Using the line of best fit for these data, what is the predicted y-value when x = 12? Round to the nearest whole number.

- **Answer:** 24
- **Hint 1:** Put the data in a table and run a linear regression.
- **Hint 2:** Then evaluate the regression line at x = 12.
- **Desmos:** Table: x1 = 1,2,3,4,5 ; y1 = 2.1,3.9,6.2,7.8,10.1 | y1 ~ m x1 + b | Output: m = 1.99, b = 0.05. | Type m*12 + b  -> 23.93.
- **Look for:** m and b from the regression panel.
- **Why:** The fitted line is y = 1.99x + 0.05. At x = 12: 23.93, which rounds to 24.
- **Trap:** Extending only the last point's pattern instead of using the fit.
- **Next time:** 'Line of best fit' with a table: use y1 ~ m x1 + b, never eyeball.

### PSD-02 · Mean with a missing value (hard)

The data set 4, 8, 8, 10, 15 has one more value, n, added. The mean of the new data set is 10. What is n?

- **Answer:** 15
- **Hint 1:** Desmos has mean(). Use x for the unknown value.
- **Hint 2:** Graph y = mean([4,8,8,10,15,x]) and y = 10.
- **Desmos:** y = mean([4, 8, 8, 10, 15, x]) | y = 10 | Intersection: (15, 10).
- **Look for:** x where the mean line hits 10.
- **Why:** 6 values with mean 10 total 60. The five known values total 45, so n = 15.
- **Trap:** Dividing by 5 instead of 6.
- **Next time:** Unknown data value: put x in the list inside mean() or median() and graph it.

### PSD-03 · Compare standard deviations (hard)

Data set A: 2, 9, 9, 9, 16. Data set B: 5, 6, 9, 12, 13. Which statement is true?

- A) Both sets have the same mean, and A has the larger standard deviation.
- B) Both sets have the same mean, and B has the larger standard deviation.
- C) The sets have different means, and A has the larger standard deviation.
- D) Both sets have the same mean and the same standard deviation.

- **Answer:** A
- **Hint 1:** Desmos has mean() and stdev().
- **Hint 2:** Type mean and stdev for each list.
- **Desmos:** A = [2, 9, 9, 9, 16] | B = [5, 6, 9, 12, 13] | mean(A) = 9, mean(B) = 9 | stdev(A) = 4.95, stdev(B) = 3.54
- **Look for:** Equal means; compare the stdev numbers.
- **Why:** Both means are 9. A has two values 7 away from the mean; B's values are at most 4 away, so A is more spread out.
- **Trap:** Thinking the three 9s in A make it less spread out.
- **Next time:** Never estimate spread by eye if you can type stdev().

### PSD-04 · Successive percent change (hard)

A price is increased by 20%, then decreased by 25%. By what percent must the new price be increased to return to the original price? Round to the nearest tenth of a percent.

- **Answer:** 11.1
- **Hint 1:** Track the multiplier: 1.2 then 0.75.
- **Hint 2:** Graph y = 1.2*0.75*(1 + x/100) and y = 1.
- **Desmos:** y = 1.2*0.75*(1 + x/100) | y = 1 | Intersection: x = 11.11.
- **Look for:** The x-value where the price returns to 1 (100%).
- **Why:** 1.2 * 0.75 = 0.9. Need 0.9(1 + p/100) = 1, so p = 11.1.
- **Trap:** Answering 5 (25 - 20).
- **Next time:** Percent chains: multiply the factors; never add percents.

### PSD-05 · Weighted average (hard)

A class of 20 students has a mean score of 78. A second class of 30 students has a mean score of m. The combined mean of all 50 students is 84. What is m?

- **Answer:** 88
- **Hint 1:** Total points = 20*78 + 30*m.
- **Hint 2:** Graph y = (20*78 + 30x)/50 and y = 84.
- **Desmos:** y = (20*78 + 30x)/50 | y = 84 | Intersection: (88, 84).
- **Look for:** x-value of the intersection.
- **Why:** 1560 + 30m = 4200, so m = 88.
- **Trap:** Averaging the means directly ((78 + m)/2 = 84 gives 90).
- **Next time:** Combined mean = total sum / total count.

### PSD-06 · Effect of removing an outlier (hard)

The data set is 12, 15, 15, 18, 20, 22, 70. If 70 is removed, by how much does the mean decrease? Round to the nearest tenth.

- **Answer:** 7.6
- **Hint 1:** Make two lists in Desmos and use mean().
- **Hint 2:** Subtract the new mean from the old.
- **Desmos:** L = [12, 15, 15, 18, 20, 22, 70] | M = [12, 15, 15, 18, 20, 22] | mean(L) - mean(M)  -> 7.571
- **Look for:** The difference 7.571.
- **Why:** Old mean 172/7 = 24.57; new mean 102/6 = 17. Decrease 7.57, about 7.6.
- **Trap:** Answering the new mean (17).
- **Next time:** Outliers pull the mean far more than the median (median moves only 18 -> 16.5 here).

### PSD-07 · Exponential regression from a table (hard)

A table gives x = 0, 1, 2, 3 and y = 5, 7.5, 11.25, 16.875. The relationship is exponential. What is y when x = 6? Round to the nearest whole number.

- **Answer:** 57
- **Hint 1:** Run an exponential regression on the table.
- **Hint 2:** Evaluate the model at 6.
- **Desmos:** Table: x1 = 0,1,2,3 ; y1 = 5, 7.5, 11.25, 16.875 | y1 ~ a b^(x1)  -> a = 5, b = 1.5 | a*b^6  -> 56.95
- **Look for:** a and b, then the value at x = 6.
- **Why:** Each step multiplies by 1.5. 5(1.5)^6 = 56.95, about 57.
- **Trap:** Treating it as linear (adding 2.5 each step).
- **Next time:** Constant ratio = exponential; use y1 ~ a b^(x1).

### PSD-08 · Percent breakdown with a leftover count (hard)

In a survey, every student named exactly one way of getting to school: 35% said bus, 25% said bike, 22% said car, and the remaining 54 students said they walk. How many more students said bus than said car?

- **Answer:** 39
- **Hint 1:** First find what percent walked: 100 minus the other three.
- **Hint 2:** That percent of the total is 54. Solve for the total, then take 35% and 22% of it.
- **Desmos:** w = 100 - 35 - 25 - 22   (shows 18) | T = 54/(w/100)   (shows 300) | 0.35T - 0.22T   (shows 39)
- **Look for:** The real total (300), then the difference.
- **Why:** Walkers are 18% of the total, so the total is 54/0.18 = 300. Bus 105, car 66, difference 39.
- **Trap:** Treating the percents as counts out of 100 (answering 13).
- **Next time:** Leftover count + leftover percent gives the total. Everything else is a percent of that total.

### PSD-09 · Two-way table with an unknown cell (very hard)

A school club records members by year and whether they joined the robotics team.  
  Juniors: joined = x, did not join = 36  
  Seniors: joined = 30, did not join = 20  
If a junior is chosen at random, the probability that the junior joined is 0.4. If a member who joined is chosen at random, what is the probability that the member is a senior? (Round to three decimal places.)

- **Answer:** 0.556
- **Hint 1:** The junior probability uses the whole junior row: x/(x + 36) = 0.4. Solve for x.
- **Hint 2:** Then 'given joined' means the denominator is everyone who joined: x + 30.
- **Desmos:** y = x/(x + 36) | y = 0.4 | Intersection at x = 24. | 30/(24 + 30)   (shows 0.5556)
- **Look for:** x from the intersection, then the new fraction.
- **Why:** x/(x + 36) = 0.4 gives x = 24. Joined total = 54, seniors who joined = 30, so 30/54 = 5/9, about 0.556.
- **Trap:** Dividing by the senior row (30/50 = 0.6) answers a different question: the chance a senior joined.
- **Next time:** 'Given ___' tells you which row or column is the denominator. Write the fraction with the unknown and solve it on the graph.

### PSD-10 · Largest missing value with a whole-number mean (very hard)

A student's first five quiz scores are 82, 91, 77, 88, and 95. After a sixth quiz, the mean of all six scores is a whole number greater than 87. Every score is a whole number less than 100. What is the greatest possible sixth score?

- **Answer:** 95
- **Hint 1:** Put the five scores in a list and use total(). The sixth score v makes the mean (total + v)/6.
- **Hint 2:** Start at 99 and go down until (total + v)/6 is a whole number.
- **Desmos:** A = [82, 91, 77, 88, 95] | total(A)   (shows 433) | M = (total(A) + v)/6   (slider v from 90 to 99, step 1) | v = 99, 98, 97, 96 give decimals; v = 95 gives 88.
- **Look for:** The largest slider value that makes M a whole number above 87.
- **Why:** 433 + v must be divisible by 6. 433 leaves remainder 1, so v leaves remainder 5: v = 95 is the largest under 100. Mean = 528/6 = 88 > 87.
- **Trap:** Answering 99, the biggest score allowed, without checking the whole-number condition.
- **Next time:** Mean conditions: work with the total. Test candidates from the boundary inward.

### PSD-11 · Find the removed value from two means (hard)

The mean of 12 numbers is 46. When one of the numbers is removed, the mean of the remaining 11 numbers is 44. What number was removed?

- **Answer:** 68
- **Hint 1:** Turn each mean into a total: total = mean x count.
- **Hint 2:** The removed number is the difference of the two totals.
- **Desmos:** 12*46   (552) | 11*44   (484) | 552 - 484   (68)
- **Look for:** The drop in the total, not the drop in the mean.
- **Why:** Totals are 552 and 484. The removed number is 552 - 484 = 68.
- **Trap:** Answering 2 (the change in the mean) or 46 - 44 times something random.
- **Next time:** Means are hard to compare; totals are easy. Convert first.

### PSD-12 · Spread the tails of symmetric data (hard)

A data set of 15 different values is symmetric about its median. A new data set is made by adding 5 to every value greater than the median and subtracting 5 from every value less than the median; the median value itself is unchanged. Compared with the original data set, which of the following is true about the new data set?

- A) Only the mean is different.
- B) Only the median is different.
- C) Only the standard deviation is different.
- D) The mean and the standard deviation are both different.

- **Answer:** C
- **Hint 1:** Try it on a small symmetric list in Desmos: A = [1, 2, 3, 4, 5].
- **Hint 2:** Build B by pushing the outer values away by 5 and compare mean, median, and stdev.
- **Desmos:** A = [1, 2, 3, 4, 5] | B = [-4, -3, 3, 9, 10] | mean(A) = mean(B) = 3, median(A) = median(B) = 3 | stdev(A) = 1.58, stdev(B) = 6.29
- **Look for:** Which of the three numbers changes between A and B.
- **Why:** The +5 and -5 changes cancel in the total, so the mean stays. The middle value is untouched, so the median stays. Values move farther from the center, so the standard deviation grows.
- **Trap:** D: thinking any change to the data must move the mean.
- **Next time:** Statistics questions: build a tiny example list in Desmos and let mean(), median(), stdev() answer.

### PSD-13 · Margin of error wording (hard)

A random sample of 400 adults living in a town was asked whether they support building a new library. Of those sampled, 62% said yes. The survey's margin of error is 4 percentage points. Which conclusion is best supported?

- A) It is plausible that between 58% and 66% of all adults in the town support the library.
- B) Exactly 62% of all adults in the town support the library.
- C) Between 58% and 66% of the 400 adults sampled support the library.
- D) It is impossible that fewer than 58% of adults in the town support the library.

- **Answer:** A
- **Hint 1:** The margin of error is about the whole population, not the people already asked.
- **Hint 2:** Reject any choice that sounds absolutely certain.
- **Desmos:** (No graph needed.) 62 - 4 = 58 and 62 + 4 = 66 give the plausible range.
- **Look for:** The choice that uses 'plausible' AND talks about the whole town.
- **Why:** 62% is known exactly for the sample. The margin gives a likely range for all town adults: 58% to 66%.
- **Trap:** C applies the range to the sample (whose value is known); D uses 'impossible'.
- **Next time:** Margin of error: population, plausible, range. Never 'exactly' or 'impossible'.

### PSD-14 · Scale drawing after enlargement (hard)

On a hiking map, 1 inch represents 2.5 miles. The map is reprinted so that every length on it is 25% longer. On the reprinted map, how many miles does 1 inch represent?

- **Answer:** 2
- **Hint 1:** Pick a trail that is 1 inch on the old map. How many real miles is it, and how long is it on the new map?
- **Hint 2:** New scale = real miles / new inches.
- **Desmos:** old = 1 inch -> 2.5 miles | new length = 1*1.25 = 1.25 inches (still 2.5 miles) | 2.5/1.25   (shows 2)
- **Look for:** Real distance stays the same; only the drawing grows.
- **Why:** The real 2.5 miles now takes 1.25 inches, so 1 inch represents 2.5/1.25 = 2 miles.
- **Trap:** Multiplying the miles by 1.25 too (3.125). The ground did not get bigger.
- **Next time:** Enlarging a drawing changes inches, never real distance.

### PSD-15 · Working back through repeated doubling (hard)

The number of birds in a reserve doubled every 3 years from 2009 to 2024. In 2024 there were 12,800 birds. How many birds were there in 2009?

- **Answer:** 400
- **Hint 1:** Count the 3-year steps between 2009 and 2024: (2024 - 2009)/3.
- **Hint 2:** Solve x * 2^steps = 12800.
- **Desmos:** n = (2024 - 2009)/3   (shows 5) | x*2^n ~ 12800   (x = 400)
- **Look for:** The number of doublings (5), not the number of years listed.
- **Why:** 15 years / 3 = 5 doublings. 12800/2^5 = 400.
- **Trap:** Counting the years 2009, 2012, ..., 2024 as 6 doublings gives 200.
- **Next time:** Steps between two dates = difference / step length. Do not count the endpoints.

### PSD-16 · Percents of a reference quantity (hard)

The number a is 20% greater than c, and the number b is 40% less than c, where c > 0. If a + b = kc, what is the value of k?

- **Answer:** 1.8
- **Hint 1:** Choose an easy value for c, like 100.
- **Hint 2:** Find a and b, add them, and divide by c.
- **Desmos:** c = 100 | a = 1.2c   (120) | b = 0.6c   (60) | (a + b)/c   (shows 1.8)
- **Look for:** The ratio (a + b)/c; change c to check it stays 1.8.
- **Why:** a = 1.2c and b = 0.6c, so a + b = 1.8c.
- **Trap:** Using 0.4c for b (that is the amount removed, not what is left), which gives 1.6.
- **Next time:** When all quantities are percents of one reference, set the reference to 100.

### PSD-17 · One percent change defined by another (very hard)

A store raised the price of a jacket by p% in January. In February it raised the new price again, this time by half as many percent as in January. Over the two months the price rose by 32% in total. What was the percent increase in February?

- **Answer:** 10
- **Hint 1:** January multiplies by (1 + p/100) and February by (1 + p/200).
- **Hint 2:** Graph y = (1 + x/100)(1 + x/200) and y = 1.32 and find the positive crossing.
- **Desmos:** y = (1 + x/100)(1 + x/200) | y = 1.32 | Positive intersection at x = 20 (January). | February = 20/2 = 10
- **Look for:** The positive intersection; then halve it.
- **Why:** (1 + p/100)(1 + p/200) = 1.32 gives p = 20. February's increase is 10%. Check: 1.2 x 1.1 = 1.32.
- **Trap:** Answering 20 (January), or splitting 32 into 21.3 and 10.7 by adding percents.
- **Next time:** Successive percent changes multiply. Graph the product against the total factor.

### PSD-18 · Ordered data with unknown values (very hard)

Five numbers are listed in increasing order: 3, a, 10, b, c. The range of the numbers is 17, the mean is 11, and b is 8 more than a. What is the value of b?

- **Answer:** 15
- **Hint 1:** Range = biggest minus smallest, so c - 3 = 17.
- **Hint 2:** Use the mean to get a + b, then use b = a + 8. Desmos can solve all of it with one regression.
- **Desmos:** [c - 3, mean([3, a, 10, b, c]), b - a] ~ [17, 11, 8]   (Desmos fits a, b, c at once) | Result: c = 20, a = 7, b = 15
- **Look for:** The fitted b.
- **Why:** c = 20. The total is 55, so a + b = 55 - 33 = 22. With b = a + 8: a = 7, b = 15. The order 3 <= 7 <= 10 <= 15 <= 20 holds.
- **Trap:** Treating 10 as the mean because it is in the middle. 10 is the median.
- **Next time:** Several stats facts about one list: write each as an equation and let one list regression solve them together.

### PSD-19 · Square-unit conversion (hard)

A room measures 6 yards by 4.5 yards. Carpet costs $3.50 per square foot. How many dollars does it cost to carpet the whole room? (1 yard = 3 feet)

- **Answer:** 850.5
- **Hint 1:** Convert each side to feet first, or multiply square yards by 3^2 = 9.
- **Hint 2:** A square yard is 9 square feet, not 3.
- **Desmos:** (6*3)(4.5*3)   (243 square feet) | 243*3.5   (850.5)
- **Look for:** Area in square feet before multiplying by the price.
- **Why:** 18 ft x 13.5 ft = 243 sq ft. 243 x 3.50 = 850.50.
- **Trap:** Using 27 sq yd x 3 = 81 sq ft (converting area with 3 instead of 9), giving 283.50.
- **Next time:** Area conversions use the factor squared; volume conversions use it cubed.

### PSD-20 · Density with mixed units (hard)

A stone block measures 20 cm by 15 cm by 0.5 m. The stone has a density of 2.7 grams per cubic centimeter. What is the mass of the block, in kilograms?

- **Answer:** 40.5
- **Hint 1:** Put every length in centimeters first: 0.5 m = 50 cm.
- **Hint 2:** Mass = density x volume, then divide grams by 1000.
- **Desmos:** V = 20*15*50   (15000 cm^3) | 2.7V   (40500 g) | 2.7V/1000   (40.5 kg)
- **Look for:** Volume in cm^3 with every side in cm.
- **Why:** Volume 15,000 cm^3 x 2.7 g/cm^3 = 40,500 g = 40.5 kg.
- **Trap:** Using 0.5 as if it were centimeters (giving 0.405 kg), or forgetting to change grams to kilograms.
- **Next time:** Write the units next to each number and convert before multiplying.

### PSD-21 · Replace one value to shift the mean (hard)

Data set A is 12, 15, 19, 22, 27. Data set B is the same except that 27 is replaced by x. The mean of B is 3 more than the mean of A. What is the value of x?

- **Answer:** 42
- **Hint 1:** Make both lists in Desmos and use mean().
- **Hint 2:** Fit mean(B) ~ mean(A) + 3 with x as the unknown.
- **Desmos:** A = [12, 15, 19, 22, 27] | B = [12, 15, 19, 22, x_1] | mean(B) ~ mean(A) + 3   (x_1 = 42)
- **Look for:** The fitted x_1.
- **Why:** The mean goes up by 3 across 5 values, so the total rises by 15. x = 27 + 15 = 42.
- **Trap:** Adding just 3 to 27 (giving 30).
- **Next time:** A change in the mean times the count = the change in the total.

### PSD-22 · When exponential passes linear (very hard)

Account A starts with $5,000 and earns 4% interest compounded once per year. Account B starts with $5,000 and gains $230 at the end of each year. After how many whole years will account A first have more money than account B?

- **Answer:** 8
- **Hint 1:** Graph A(x) = 5000(1.04)^x and B(x) = 5000 + 230x.
- **Hint 2:** B starts ahead. Find where the curves cross, then the first whole year past it.
- **Desmos:** y = 5000(1.04)^x | y = 5000 + 230x | Crossing near x = 7.9 (zoom far in near y = 6800) | Check x = 7: A = 6579.66, B = 6610.  x = 8: A = 6842.85, B = 6840.
- **Look for:** The first whole number of years where the curve is above the line.
- **Why:** The linear account leads at first; the exponential one grows faster later. At 8 years A = 6842.85 > 6840 = B; at 7 years A is still behind.
- **Trap:** Thinking A is ahead from year 1 because 4% of 5000 is 200 (it is less than 230), or rounding 7.9 down to 7.
- **Next time:** Exponential vs linear: graph both, zoom on the crossing, and test the whole numbers on each side.

### PSD-23 · Chained 'of those' percents and the complement (hard)

Of 800 people surveyed, 45% own a pet. Of the pet owners, 60% own a dog. Of the dog owners, 25% walk their dog every day. How many of the 800 people surveyed are NOT dog owners who walk their dog every day?

- **Answer:** 746
- **Hint 1:** Multiply down the chain: 800 x 0.45 x 0.60 x 0.25.
- **Hint 2:** The question asks for everyone else.
- **Desmos:** 800*0.45*0.6*0.25   (54) | 800 - 54   (746)
- **Look for:** The last count in the chain, then the complement.
- **Why:** 360 own pets, 216 own dogs, 54 walk daily. 800 - 54 = 746.
- **Trap:** Stopping at 54, or subtracting only from the dog owners (216 - 54 = 162).
- **Next time:** 'Of those' means multiply. Then re-read for NOT.

### PSD-24 · Best-fit slope over a multi-unit change (hard)

A tutor recorded hours of practice x and test score y for four students: (2, 51), (5, 58.5), (9, 68.5), (12, 76). A line of best fit models the data. According to the line, by how many points does the predicted score increase for every 6 additional hours of practice?

- **Answer:** 15
- **Hint 1:** Put the points in a table and regress y_1 ~ m x_1 + b.
- **Hint 2:** The slope is the change for 1 hour. The question asks about 6 hours.
- **Desmos:** Table: x_1 = 2, 5, 9, 12 and y_1 = 51, 58.5, 68.5, 76 | y_1 ~ m x_1 + b   (m = 2.5, b = 46) | 6m   (15)
- **Look for:** The slope, then multiplied by 6.
- **Why:** The points lie on y = 2.5x + 46. Each hour adds 2.5 points, so 6 hours add 15.
- **Trap:** Answering 2.5 (the per-hour slope) or 61 (the predicted score at x = 6).
- **Next time:** Slope is per ONE unit of x. For a block of k units, multiply by k.

### PSD-25 · Sampling bias: voluntary response (hard)

A radio station asked listeners to call in and say whether they support a new city stadium. Of the 2,400 people who called, 81% said yes. Which statement best explains why the result should not be used to estimate support among all adults in the city?

- A) The sample of 2,400 is too small for a city.
- B) The callers chose themselves, so they were not a random sample of the city's adults.
- C) The station did not allow enough time for people to call.
- D) 81% is too high to be a reliable estimate.

- **Answer:** B
- **Hint 1:** Ask how the people in the sample were chosen.
- **Hint 2:** Size can't fix a sample that was not random.
- **Desmos:** (No graph needed.) Check: was the sample chosen at random from the group you want to describe?
- **Look for:** The choice about how the sample was selected.
- **Why:** People who call in pick themselves and tend to feel strongly; that is voluntary-response bias. A bigger sample of the same kind is still biased.
- **Trap:** A: blaming the sample size. 2,400 is plenty if it were random.
- **Next time:** Generalize only from a random sample, and only to the group it was drawn from.

### PSD-26 · Ratio mixing as a multiple (hard)

A paint color is mixed using blue and yellow paint in the ratio 3 to 5. A first batch uses 12 cups of blue paint. A second batch, mixed in the same ratio, uses 35 cups of yellow paint. The amount of blue paint in the second batch is how many times the amount of blue paint in the first batch?

- **Answer:** 1.75
- **Hint 1:** Find the blue in batch 2 from 3/5 = blue/35.
- **Hint 2:** Then divide by the 12 cups of batch 1.
- **Desmos:** 3/5 ~ b_2/35   (b_2 = 21) | 21/12   (1.75)
- **Look for:** Blue in batch 2, compared with 12.
- **Why:** Blue = 35 x 3/5 = 21. 21/12 = 1.75.
- **Trap:** Comparing yellow amounts (35/20), or putting yellow on top on one side and blue on the other.
- **Next time:** Proportions: keep the same item on top on both sides, then answer the comparison they asked for.

### PSD-27 · Compare yearly gains, not balances (very hard)

Account A starts with $4,000 and earns 6% interest compounded once a year. Account B starts with $5,000 and gains exactly $250 each year. In which year (1st, 2nd, 3rd, ...) does account A first gain more money during that year than account B gains? Give the year number.

- **Answer:** 2
- **Hint 1:** A's gain in year n is 4000(1.06)^(n - 1) x 0.06. B's gain is always 250.
- **Hint 2:** Type the gains for n = 1, 2, 3 or graph the gain function against y = 250.
- **Desmos:** G(x) = 4000(1.06)^(x - 1)*0.06 | y = 250 | G(1) = 240, G(2) = 254.4
- **Look for:** The first whole year where G is above 250.
- **Why:** Year 1 A gains 240 < 250. Year 2 A gains 254.40 > 250. (A's balance is still smaller than B's, which is a different question.)
- **Trap:** Comparing balances instead of yearly gains, which gives a much later year.
- **Next time:** Read whether the question compares totals or amounts gained per period.

### PSD-28 · Mean equals median: graph both (very hard)

A data set consists of the five numbers 4, 7, 9, 12, and x. The mean of the data set is equal to its median. What is the greatest possible value of x?

- **Answer:** 13
- **Hint 1:** Let x be the graph variable and graph the mean and the median as two curves.
- **Hint 2:** Type y = mean([4, 7, 9, 12, x]) and y = median([4, 7, 9, 12, x]) and click every intersection.
- **Desmos:** y = mean([4, 7, 9, 12, x]) | y = median([4, 7, 9, 12, x]) | Intersections at x = 3, 8, and 13
- **Look for:** All three intersections; the question asks for the largest.
- **Why:** If x ≤ 7 the median is 7, so x = 3. If 7 ≤ x ≤ 9 the median is x, so x = 8. If x ≥ 9 the median is 9, so x = 13.
- **Trap:** Assuming the median is always 9 and stopping at one case, or finding only x = 8.
- **Next time:** When the unknown moves the median, graph mean and median as functions of x and read every crossing.

## Geometry and Trigonometry

### GEO-01 · Circle: complete the square (hard)

The graph of x^2 + y^2 - 6x + 10y + 9 = 0 is a circle. What is its radius?

- **Answer:** 5
- **Hint 1:** Type the equation into Desmos exactly as given.
- **Hint 2:** Click the leftmost and rightmost points; half the distance is the radius.
- **Desmos:** x^2 + y^2 - 6x + 10y + 9 = 0 | Leftmost point (-2, -5), rightmost point (8, -5). Diameter 10, radius 5.
- **Look for:** Width of the circle.
- **Why:** (x - 3)^2 + (y + 5)^2 = 9 + 25 - 9 = 25. Radius 5.
- **Trap:** Answering 25 (radius squared).
- **Next time:** Any circle equation: graph it and read the center and extreme points.

### GEO-02 · Line tangent to circle (very hard)

The line y = x + k, where k > 0, is tangent to the circle x^2 + y^2 = 8. What is the value of k?

- **Answer:** 4
- **Hint 1:** Graph the circle and the line with a slider on k.
- **Hint 2:** Slide k until the line touches the circle at exactly one point.
- **Desmos:** x^2 + y^2 = 8 | y = x + k  (slider k, from 0 to 10) | Tangent at k = 4, touching (-2, 2).
- **Look for:** One touching point.
- **Why:** Distance from the center (0, 0) to the line equals the radius: k/sqrt(2) = sqrt(8), so k = 4.
- **Trap:** k = sqrt(8) = 2.83 (that is the radius, not the intercept).
- **Next time:** Tangent line: slide until one touch point.

### GEO-03 · Area from intersecting lines (hard)

The lines y = 2x and y = -x + 9 and the x-axis form a triangle. What is the area of the triangle?

- **Answer:** 27
- **Hint 1:** Graph both lines and y = 0.
- **Hint 2:** Click the three corners, then use (1/2)(base)(height).
- **Desmos:** y = 2x | y = -x + 9 | Corners: (0, 0), (3, 6), (9, 0).
- **Look for:** Base 9 on the x-axis, height 6.
- **Why:** Area = (1/2)(9)(6) = 27.
- **Trap:** Using the slanted side as the base.
- **Next time:** Coordinate geometry: graph, click the corners, then compute.

### GEO-04 · Trig cofunction (hard)

In degrees, sin((2x + 10)°) = cos((3x - 5)°). What is the smallest positive value of x?

- **Answer:** 17
- **Hint 1:** Switch Desmos to degree mode (wrench icon).
- **Hint 2:** Graph both sides and find the first positive intersection.
- **Desmos:** Settings: Degrees | y = sin(2x + 10) | y = cos(3x - 5) | First positive intersection: x = 17.
- **Look for:** Smallest positive intersection.
- **Why:** sin A = cos B when A + B = 90: 5x + 5 = 90 gives x = 17.
- **Trap:** Forgetting degree mode; in radians you get nonsense.
- **Next time:** Always check degree vs radian mode for trig.

### GEO-05 · Circle tangent to both axes (very hard)

A circle in the first quadrant is tangent to both the x-axis and the y-axis and passes through the point (2, 1). What is the greatest possible radius?

- **Answer:** 5
- **Hint 1:** Tangent to both axes means the center is (a, a) and the radius is a. Graph (x - a)^2 + (y - a)^2 = a^2 with a slider on a (Desmos reserves r for polar graphs, so do not use r).
- **Hint 2:** Plot (2, 1) and slide a until the circle passes through it. There are two answers.
- **Desmos:** (x - a)^2 + (y - a)^2 = a^2  (slider a, 0 to 10) | (2, 1) | The circle passes through the point at a = 1 and a = 5.
- **Look for:** Both slider values, then the greater one.
- **Why:** (2 - r)^2 + (1 - r)^2 = r^2 gives r^2 - 6r + 5 = 0, so r = 1 or 5.
- **Trap:** Stopping at r = 1.
- **Next time:** 'Greatest possible' hints at two answers; keep sliding.

### GEO-06 · Circle from center and point (hard)

A circle has center (2, -1) and passes through (5, 3). Its area is k*pi. What is k?

- **Answer:** 25
- **Hint 1:** Graph (x - 2)^2 + (y + 1)^2 = s with a slider on s (s is r^2).
- **Hint 2:** Slide until the circle hits (5, 3).
- **Desmos:** (x - 2)^2 + (y + 1)^2 = s  (slider s) | (5, 3) | s = 25 when the circle passes through the point.
- **Look for:** s, which is r^2 and equals k.
- **Why:** r^2 = 3^2 + 4^2 = 25, and area = 25*pi.
- **Trap:** Answering r = 5.
- **Next time:** Slide r^2 directly when the question asks for area.

### GEO-07 · Rectangle from perimeter and area (hard)

A rectangle has perimeter 40 and area 96. What is the length of its longer side?

- **Answer:** 12
- **Hint 1:** If one side is x, the other is 20 - x.
- **Hint 2:** Graph y = x(20 - x) and y = 96.
- **Desmos:** y = x(20 - x) | y = 96 | Intersections: x = 8 and x = 12.
- **Look for:** The two side lengths, then the larger.
- **Why:** x(20 - x) = 96 gives x^2 - 20x + 96 = 0, x = 8 or 12.
- **Trap:** Using 40 - x for the other side.
- **Next time:** Turn geometry word problems into one-variable functions and intersect.

### GEO-08 · Circle with a common coefficient (hard)

A circle in the xy-plane has equation 3x^2 + 3y^2 - 12x + 18y = 9. What is the radius of the circle?

- **Answer:** 4
- **Hint 1:** Type the equation as given; Desmos draws the circle.
- **Hint 2:** Click the top and bottom points of the circle and take half their distance.
- **Desmos:** 3x^2 + 3y^2 - 12x + 18y = 9 | Click the top and bottom: a = (2, 1), b = (2, -7) | distance(a, b)/2   (4)
- **Look for:** Half the vertical distance across the circle.
- **Why:** Divide by 3: x^2 + y^2 - 4x + 6y = 3. Completing squares: (x - 2)^2 + (y + 3)^2 = 3 + 4 + 9 = 16, so r = 4.
- **Trap:** Completing the square without dividing by 3 first gives sqrt(9 + 12 + 27) or other wrong values.
- **Next time:** Circle radius or center: let Desmos draw it and measure, or divide out the x^2 coefficient before completing the square.

### GEO-09 · General form of a circle from center and radius (hard)

A circle has center (-3, 5) and radius 6. Its equation can be written as x^2 + y^2 + 6x - 10y + c = 0, where c is a constant. What is the value of c?

- **Answer:** -2
- **Hint 1:** Put a few points of the circle in a table, then fit the general form.
- **Hint 2:** Or expand (x + 3)^2 + (y - 5)^2 = 36 and move 36 to the left.
- **Desmos:** (x + 3)^2 + (y - 5)^2 = 36 | Table of points on it: (3, 5), (-3, 11), (-9, 5) | x_1^2 + y_1^2 + 6x_1 - 10y_1 + c ~ 0   (c = -2)
- **Look for:** The fitted c.
- **Why:** x^2 + 6x + 9 + y^2 - 10y + 25 = 36, so x^2 + y^2 + 6x - 10y - 2 = 0.
- **Trap:** Answering -36. c is h^2 + k^2 - r^2 = 9 + 25 - 36.
- **Next time:** To find constants in a circle equation, give Desmos points on the circle and regress.

### GEO-10 · Concentric circle with a larger radius (hard)

Circle P has equation (x - 1)^2 + (y + 4)^2 = 20.25. Circle Q has the same center as circle P, and its radius is 2 more than the radius of circle P. The equation of circle Q is (x - 1)^2 + (y + 4)^2 = k. What is the value of k?

- **Answer:** 42.25
- **Hint 1:** Take the square root of 20.25 to get P's radius.
- **Hint 2:** Add 2 to the radius, then square it.
- **Desmos:** sqrt(20.25)   (4.5) | (4.5 + 2)^2   (42.25) | Graph both circles: they share a center and are 2 units apart everywhere.
- **Look for:** Two circles with the same center, 2 units apart.
- **Why:** r = 4.5, new radius 6.5, so k = 6.5^2 = 42.25.
- **Trap:** Adding 2 to 20.25 (giving 22.25). The right side is r^2, not r.
- **Next time:** Change the radius, then square. Never change r^2 directly.

### GEO-11 · Other end of a diameter (hard)

A circle has center (2, -1). One endpoint of a diameter is (7, 3). If the other endpoint is (p, q), what is p + q?

- **Answer:** -8
- **Hint 1:** The center is the midpoint of the diameter.
- **Hint 2:** Other end = 2 x center - known end.
- **Desmos:** C = (2, -1),  P = (7, 3) | Q = 2C - P   (shows (-3, -5)) | Check: midpoint(P, Q) = (2, -1)
- **Look for:** The point Q opposite P through the center.
- **Why:** Moving from (7, 3) to the center is (-5, -4). Do it again: (-3, -5). Sum -8.
- **Trap:** Averaging the center and the endpoint (giving the midpoint of a radius).
- **Next time:** Opposite point through a center = 2(center) - point.

### GEO-12 · Arc length with an isosceles step (very hard)

Points A and B lie on a circle with center O and radius 9. In triangle OAB, angle OAB measures 25 degrees. The length of minor arc AB is k*pi. What is the value of k?

- **Answer:** 6.5
- **Hint 1:** OA and OB are both radii, so triangle OAB is isosceles: angle OBA is also 25 degrees.
- **Hint 2:** Central angle = 180 - 2(25). Arc = (angle/360) x 2*pi*9.
- **Desmos:** A_c = 180 - 2*25   (130) | (A_c/360)*2*9   (6.5, the coefficient of pi)
- **Look for:** The central angle first (130), then the fraction of the circumference.
- **Why:** Central angle 130 degrees. Arc = (130/360)(18 pi) = 6.5 pi.
- **Trap:** Using 25 or 50 degrees as the central angle.
- **Next time:** Arc questions: get the central angle, then arc/circumference = angle/360.

### GEO-13 · Cosine of a large radian angle (hard)

What is the value of cos(14pi/3)?

- **Answer:** -0.5
- **Hint 1:** Make sure Desmos is in radian mode, then just type it.
- **Hint 2:** 14pi/3 = 4pi + 2pi/3, and adding full turns does not change cosine.
- **Desmos:** (radian mode) cos(14pi/3)   (shows -0.5) | Point (cos(14pi/3), sin(14pi/3)) lands at (-0.5, 0.866) on the unit circle.
- **Look for:** The decimal -0.5.
- **Why:** 14pi/3 - 4pi = 2pi/3, which is 120 degrees. cos 120 degrees = -1/2.
- **Trap:** Typing it in degree mode (gives a meaningless 0.99...).
- **Next time:** Check the angle mode in the settings wrench before any trig.

### GEO-14 · Cofunction with linear angles (hard)

In a right triangle, the two acute angles measure (3x + 12) degrees and (2x - 7) degrees. Also, sin((3x + 12) degrees) = cos((2x - 7) degrees). What is the value of x?

- **Answer:** 17
- **Hint 1:** sin of an angle equals cos of its complement, so the two angles add to 90.
- **Hint 2:** In degree mode you can also fit sin(3x_1 + 12) ~ cos(2x_1 - 7) and check both angles are acute.
- **Desmos:** (degree mode) 3x_1 + 12 + 2x_1 - 7 ~ 90   (x_1 = 17) | Check: sin(63) = cos(27) = 0.891
- **Look for:** x that makes the two angles add to 90.
- **Why:** 5x + 5 = 90 gives x = 17. The angles are 63 and 27 degrees.
- **Trap:** Setting the angles equal (3x + 12 = 2x - 7).
- **Next time:** sin A = cos B with acute angles means A + B = 90.

### GEO-15 · Altitude to the hypotenuse (very hard)

Right triangle ABC has legs AC = 15 and BC = 20. The altitude from C meets hypotenuse AB at D. What is the length of AD?

- **Answer:** 9
- **Hint 1:** Find AB first, then the altitude CD from the two ways of writing the area.
- **Hint 2:** Then use the right triangle ACD: AD^2 + CD^2 = 15^2.
- **Desmos:** AB = sqrt(15^2 + 20^2)   (25) | 15*20/2 ~ AB*h/2   (h = 12) | sqrt(15^2 - 12^2)   (9)
- **Look for:** AD, the piece of the hypotenuse next to the shorter leg.
- **Why:** Area = 150 = (1/2)(25)(h), so h = 12. AD = sqrt(225 - 144) = 9. (Also AD = AC^2/AB = 225/25.)
- **Trap:** Answering 16 (that is DB) or 12 (the altitude).
- **Next time:** Altitude to the hypotenuse: area two ways gives the altitude; small triangles are similar to the big one.

### GEO-16 · 30-60-90 from a perimeter (hard)

A 30-60-90 triangle has a perimeter of 18 + 6*sqrt(3). What is the length of its longest side?

- **Answer:** 12
- **Hint 1:** Sides are x, x*sqrt(3), and 2x. Their sum is the perimeter.
- **Hint 2:** Fit x ~ with one regression, then remember the longest side is 2x.
- **Desmos:** 3x_1 + x_1*sqrt(3) ~ 18 + 6sqrt(3)   (x_1 = 6) | 2x_1   (12)
- **Look for:** The hypotenuse 2x.
- **Why:** x(3 + sqrt 3) = 6(3 + sqrt 3), so x = 6 and the hypotenuse is 12.
- **Trap:** Answering 6*sqrt(3) (about 10.39), the long leg. The hypotenuse is always the longest side.
- **Next time:** Special triangles: write all sides from one letter, solve, then pick the side they asked for.

### GEO-17 · Triangle area from two sides and the angle between them (hard)

In triangle PQR, PQ = 10, PR = 14, and angle QPR measures 30 degrees. What is the area of triangle PQR?

- **Answer:** 35
- **Hint 1:** Drop a height from Q to side PR. In degree mode the height is 10 sin(30).
- **Hint 2:** Area = (1/2)(base)(height).
- **Desmos:** (degree mode) h = 10sin(30)   (5) | 14*h/2   (35)
- **Look for:** The height from the angle, then half base times height.
- **Why:** Height = 10 sin 30 = 5. Area = (1/2)(14)(5) = 35.
- **Trap:** Forgetting the 1/2 (70) or using 10 as the height (70).
- **Next time:** Area with an angle = (1/2) a b sin C. Degree mode!

### GEO-18 · Area of a triangle from three points (hard)

What is the area of the triangle with vertices (-2, 1), (5, 3), and (1, 8)?

- **Answer:** 21.5
- **Hint 1:** Type the three points into polygon( ) in Desmos.
- **Hint 2:** Desmos shows the area when you click the shaded triangle (or use the box-minus-corners method).
- **Desmos:** polygon((-2, 1), (5, 3), (1, 8)) | Area shown: 21.5
- **Look for:** The area label on the polygon.
- **Why:** Box 7 by 7 = 49. Corner triangles: (1/2)(7)(2) = 7, (1/2)(4)(5) = 10, (1/2)(3)(7) = 10.5. 49 - 27.5 = 21.5.
- **Trap:** Arithmetic slips in the box method. Let polygon() do it.
- **Next time:** Shapes from coordinates: polygon() for area, distance() for lengths.

### GEO-19 · Parallel segment: area of the trapezoid (very hard)

In triangle ABC, point D is on AB and point E is on AC so that DE is parallel to BC. AD = 6 and DB = 4. The area of triangle ADE is 54. What is the area of the region DBCE (between DE and BC)?

- **Answer:** 96
- **Hint 1:** Triangle ADE is similar to triangle ABC with scale 6/10.
- **Hint 2:** Areas scale by the square: area ABC = 54 x (10/6)^2.
- **Desmos:** 54*(10/6)^2   (150) | 150 - 54   (96)
- **Look for:** The big triangle's area minus the small one's.
- **Why:** Scale factor 10/6, area factor 100/36. 54 x 100/36 = 150. 150 - 54 = 96.
- **Trap:** Using the linear scale (54 x 10/6 = 90) or using DB/AD = 4/6.
- **Next time:** Similar figures: lengths scale by k, areas by k^2, volumes by k^3.

### GEO-20 · Similar solids: area ratio to volume ratio (very hard)

Two cones are similar. The ratio of their surface areas is 9 to 16. The smaller cone has a volume of 54 cubic inches. What is the volume of the larger cone, in cubic inches?

- **Answer:** 128
- **Hint 1:** Surface area ratio = k^2, so k = sqrt(16/9) = 4/3.
- **Hint 2:** Volume ratio = k^3.
- **Desmos:** k = sqrt(16/9) | 54k^3   (128)
- **Look for:** k first, then cube it.
- **Why:** k = 4/3. Volume = 54 x 64/27 = 128.
- **Trap:** Multiplying by 16/9 (giving 96).
- **Next time:** Area ratio -> square root -> length ratio -> cube for volume.

### GEO-21 · Scaled cylinder volume (hard)

The radius of a cylinder is increased by 50% and its height is decreased by 20%. By what percent does the volume increase?

- **Answer:** 80
- **Hint 1:** Use any starting cylinder, like radius 1 and height 1, so the volume is pi.
- **Hint 2:** New volume = pi(1.5)^2(0.8).
- **Desmos:** V(a, h) = pi a^2 h   (use a for the radius; r is reserved in Desmos) | V(1.5, 0.8)/V(1, 1)   (1.8) | 1.8 - 1 = 0.8 -> 80%
- **Look for:** The volume factor 1.8.
- **Why:** Factor = 1.5^2 x 0.8 = 2.25 x 0.8 = 1.8, an 80% increase.
- **Trap:** Adding percents (50 - 20 = 30) or not squaring the radius factor (1.5 x 0.8 = 1.2, 20%).
- **Next time:** Scale factors multiply, and a factor on the radius gets squared.

### GEO-22 · Square pyramid height from surface areas (very hard)

A right pyramid has a square base. Its total surface area is 384 square meters and its lateral surface area (the four triangles only) is 240 square meters. What is the height of the pyramid, in meters?

- **Answer:** 8
- **Hint 1:** Base area = total - lateral, so the base side is its square root.
- **Hint 2:** Each triangle has area 60 = (1/2)(side)(slant height). Then height^2 + (side/2)^2 = slant^2.
- **Desmos:** s = sqrt(384 - 240)   (12) | 240/4 ~ (1/2)s*l_1   (l_1 = 10) | sqrt(l_1^2 - (s/2)^2)   (8)
- **Look for:** Slant height first, then the true height.
- **Why:** Base 144, side 12. Slant height 60/(6) = 10. Height = sqrt(100 - 36) = 8.
- **Trap:** Reporting the slant height 10 as the height, or using the full side 12 instead of half.
- **Next time:** Pyramids: the slant height lives on a face; the height drops through the inside. Connect them with half the base side.

### GEO-23 · Slope of a tangent line to a circle (hard)

A circle has center (1, 2) and passes through the point (4, 6). What is the slope of the line tangent to the circle at (4, 6)?

- **Answer:** -0.75
- **Hint 1:** The radius to (4, 6) has slope (6 - 2)/(4 - 1).
- **Hint 2:** A tangent is perpendicular to the radius: negative reciprocal.
- **Desmos:** (x - 1)^2 + (y - 2)^2 = 25 | y - 6 = m(x - 4)   (slider m) | Slide m until the line only touches the circle: m = -0.75
- **Look for:** The line that touches the circle at exactly one point.
- **Why:** Radius slope 4/3, so tangent slope -3/4.
- **Trap:** Answering 4/3 (the radius slope) or 3/4 (forgetting the sign).
- **Next time:** Tangent to a circle is perpendicular to the radius at the touch point.

### GEO-24 · Which point is not inside a circle (hard)

The circle (x - 2)^2 + (y + 1)^2 = 25 is graphed in the xy-plane. Which point does NOT lie in the interior of the circle?

- A) (5, 2)
- B) (-1, -4)
- C) (6, 2)
- D) (0, 3)

- **Answer:** C
- **Hint 1:** Plot the circle and the four points.
- **Hint 2:** A point exactly on the circle is not in the interior. Check with (x - 2)^2 + (y + 1)^2 for each point.
- **Desmos:** (x - 2)^2 + (y + 1)^2 = 25 | (5, 2), (-1, -4), (6, 2), (0, 3) | Values: 18, 18, 25, 20. Only (6, 2) reaches 25.
- **Look for:** The point sitting on the curve, not inside it.
- **Why:** (6 - 2)^2 + (2 + 1)^2 = 16 + 9 = 25, so (6, 2) is on the circle. The others give less than 25.
- **Trap:** Thinking a point on the circle counts as inside.
- **Next time:** Inside: value < r^2. On: = r^2. Outside: > r^2.

### GEO-25 · Circle constant from a given radius (hard)

The graph of x^2 + y^2 - 8x + 2y = k in the xy-plane is a circle with radius 5. What is the value of k?

- **Answer:** 8
- **Hint 1:** Type it with a slider for k (widen the slider range).
- **Hint 2:** Click the top and bottom of the circle and slide k until distance(a, b)/2 = 5.
- **Desmos:** x^2 + y^2 - 8x + 2y = k   (slider k from -20 to 40) | Slide until the circle is 10 units tall: k = 8
- **Look for:** A circle exactly 10 units across.
- **Why:** (x - 4)^2 + (y + 1)^2 = k + 16 + 1 = 25, so k = 8.
- **Trap:** Answering 25 (that is r^2, after completing the square).
- **Next time:** Completing the square adds the same numbers to the right side; let a slider find k if unsure.

### GEO-26 · Similar right triangles with a tangent ratio (hard)

Right triangles ABC and DEF are similar, with right angles at C and F, and A corresponds to D. If tan A = 8/15 and DE = 51, what is the length of EF?

- **Answer:** 24
- **Hint 1:** tan A = 8/15 means legs 8 and 15, so the hypotenuse is 17.
- **Hint 2:** EF is opposite D (like BC is opposite A). Scale by 51/17.
- **Desmos:** sqrt(8^2 + 15^2)   (17) | 8*(51/17)   (24)
- **Look for:** The side opposite the matching angle, times the scale.
- **Why:** sin D = sin A = 8/17. EF = 51 x 8/17 = 24.
- **Trap:** Using the adjacent side (45) or the wrong triangle's labels.
- **Next time:** Similar triangles share trig ratios; match vertices in order first.

### GEO-27 · Unknown coordinate on a circle (hard)

The point (6, k), where k > 0, lies on the circle x^2 + y^2 = 85. What is the value of k?

- **Answer:** 7
- **Hint 1:** Fit distance((6, k), (0, 0)) ~ sqrt(85).
- **Hint 2:** Or graph the circle and x = 6 and click the top crossing.
- **Desmos:** x^2 + y^2 = 85 | x = 6 | Top intersection: (6, 7)
- **Look for:** The crossing with positive y.
- **Why:** 36 + k^2 = 85 gives k^2 = 49, k = 7.
- **Trap:** Answering -7 or sqrt(85).
- **Next time:** Points on a circle: plug the known coordinate in, or intersect with a vertical line.

### GEO-28 · Rectangle from diagonal and side difference (hard)

The diagonal of a rectangle is 29 inches long. One side of the rectangle is 1 inch longer than the other. What is the length of the longer side, in inches?

- **Answer:** 21
- **Hint 1:** Call the short side x; the long side is x + 1.
- **Hint 2:** Fit x_1^2 + (x_1 + 1)^2 ~ 29^2 or graph both sides and take the positive crossing.
- **Desmos:** y = x^2 + (x + 1)^2 | y = 841 | Positive intersection: x = 20 | Longer side = 20 + 1 = 21
- **Look for:** The positive intersection, then add 1.
- **Why:** x^2 + (x + 1)^2 = 841 gives 2x^2 + 2x - 840 = 0, x^2 + x - 420 = 0, (x - 20)(x + 21) = 0. Sides 20 and 21.
- **Trap:** Answering 20, the shorter side.
- **Next time:** Set the unknown as the short side, solve, then re-read which side is asked.

### GEO-29 · Midline of a triangle (which must be true) (very hard)

In triangle ABC, D is the midpoint of AB. Point E lies on AC so that DE is parallel to BC, and point F lies on BC so that EF is parallel to AB. If BC = 18, which of the following must be true?  
  I. DE = 9  
  II. AE = EC  
  III. BF = 9

- A) I only
- B) I and II only
- C) II and III only
- D) I, II, and III

- **Answer:** D
- **Hint 1:** A segment from a midpoint, parallel to a side, lands on the midpoint of the third side and is half that side.
- **Hint 2:** Use it twice: once for DE (from D) and once for EF (from E).
- **Desmos:** Build an example: A = (0, 8), B = (-6, 0), C = (12, 0) (BC = 18) | D = midpoint(A, B), E = midpoint(A, C) | distance(D, E)   (9) | F = midpoint(B, C); check slope of EF equals slope of AB | distance(B, F)   (9)
- **Look for:** All three statements hold in the example; move A around and they still hold.
- **Why:** DE is parallel to BC from the midpoint of AB, so E is the midpoint of AC (II) and DE = 18/2 = 9 (I). EF is parallel to AB from the midpoint E of AC, so F is the midpoint of BC and BF = 9 (III).
- **Trap:** Eyeballing the figure or assuming only the first statement follows. Test each statement on its own.
- **Next time:** Parallel + midpoint means midpoint + half length. Build an example in Desmos with midpoint() and move the points.

### GEO-30 · Shape made of equilateral triangles (hard)

A logo is a large equilateral triangle with perimeter 48 cm. Segments joining the midpoints of its sides divide it into 4 congruent equilateral triangles, and the 3 corner triangles are shaded. The total shaded area is k*sqrt(3) square centimeters. What is the value of k?

- **Answer:** 48
- **Hint 1:** Large side = 48/3 = 16, so each small triangle has side 8.
- **Hint 2:** Area of an equilateral triangle with side s is (sqrt(3)/4)s^2.
- **Desmos:** s = 48/3/2   (8) | 3*(1/4)s^2   (48, the coefficient of sqrt(3))
- **Look for:** The coefficient in front of sqrt(3).
- **Why:** Each small triangle has area (sqrt 3/4)(64) = 16 sqrt 3. Three of them: 48 sqrt 3.
- **Trap:** Using side 16 for the small triangles, or shading all 4.
- **Next time:** Equilateral: height = (s/2)sqrt(3), area = (sqrt(3)/4)s^2. Count only the shaded pieces.

### GEO-31 · Sum of four of the eight angles at parallel lines (very hard)

Two parallel lines are cut by a transversal, forming eight angles. One of the eight angles measures 52 degrees. Which of the following could NOT be the sum of the measures of four of the eight angles, in degrees?

- A) 284
- B) 360
- C) 400
- D) 512

- **Answer:** C
- **Hint 1:** The eight angles have only two sizes: 52 and 180 - 52 = 128, four of each.
- **Hint 2:** A sum of four is j(52) + (4 - j)(128) for j = 0 to 4. List those five values.
- **Desmos:** L = [0, 1, 2, 3, 4] | 52L + 128(4 - L)   (shows [512, 436, 360, 284, 208])
- **Look for:** Which choice is missing from the list of possible sums.
- **Why:** The only possible sums are 512, 436, 360, 284 and 208. 400 is not one of them.
- **Trap:** Assuming all eight angles are 52 degrees, or forgetting that sums can mix the two sizes.
- **Next time:** Parallel lines cut by a transversal make only two angle sizes: an angle and its supplement.

### GEO-32 · Tangent of the other acute angle (hard)

In right triangle ABC, angle C is the right angle and tan A = 7/24. Triangle DEF is similar to triangle ABC, with D, E, and F corresponding to A, B, and C. What is the value of tan E? (Round to three decimal places.)

- **Answer:** 3.429
- **Hint 1:** E matches B, the other acute angle of triangle ABC.
- **Hint 2:** The tangent of the other acute angle is the reciprocal: opposite and adjacent swap.
- **Desmos:** tan A = 7/24 means legs 7 (opposite A) and 24 (adjacent to A). | tan B = 24/7   (3.4286)
- **Look for:** The reciprocal of 7/24.
- **Why:** Similar triangles share angles, so tan E = tan B = 24/7, about 3.429.
- **Trap:** Answering 7/24 (that is tan D) or 7/25 (a sine).
- **Next time:** The two acute angles of a right triangle have reciprocal tangents. Similar triangles share every trig ratio.

### GEO-33 · Cube edge ratio to surface-area ratio (hard)

The edge lengths of two cubes are in the ratio 2 to 5. The smaller cube has a surface area of 96 square inches. What is the surface area of the larger cube, in square inches?

- **Answer:** 600
- **Hint 1:** Surface areas scale by the square of the edge ratio.
- **Hint 2:** Or: smaller edge = sqrt(96/6) = 4, larger edge = 10, area = 6(10)^2.
- **Desmos:** 96*(5/2)^2   (600) | Check: s = sqrt(96/6) = 4, 4*(5/2) = 10, 6*10^2 = 600
- **Look for:** The area factor (5/2)^2 = 6.25.
- **Why:** Area factor 25/4. 96 x 25/4 = 600.
- **Trap:** Multiplying by 5/2 (240) or by (5/2)^3 (1500).
- **Next time:** Edges x k, areas x k^2, volumes x k^3.

### GEO-34 · Scaled cylinder from a known volume (hard)

A cylinder has a volume of 120*pi cubic meters. A second cylinder has 3 times the radius and 1/4 the height of the first. The volume of the second cylinder is k*pi cubic meters. What is the value of k?

- **Answer:** 270
- **Hint 1:** Pick any radius for the first cylinder, find the height that gives 120*pi, then build the second one.
- **Hint 2:** Or multiply 120 by 3^2 x 1/4.
- **Desmos:** a = 2   (any radius) | a^2 h_1 ~ 120   (h_1 = 30, pi cancels) | (3a)^2 (h_1/4)   (270) | Change a to 5: the result is still 270.
- **Look for:** The same answer for two different starting radii.
- **Why:** Volume factor = 3^2 x 1/4 = 9/4. 120 x 9/4 = 270.
- **Trap:** Using 3 x 1/4 = 3/4 (forgetting to square the radius), giving 90.
- **Next time:** When factors confuse you, plug real numbers and check with a second set.

### GEO-35 · Parallel segment in a right triangle: leftover piece (very hard)

Right triangle ABC has its right angle at C, AC = 12, and an area of 54. Point D is on AC and point E is on AB so that DE is parallel to BC and DE = 6. What is the length of DC?

- **Answer:** 4
- **Hint 1:** Use the area to find BC: (1/2)(12)(BC) = 54.
- **Hint 2:** Triangle ADE is similar to ABC: AD/AC = DE/BC. Then DC = AC - AD.
- **Desmos:** (1/2)(12)b_1 ~ 54   (b_1 = 9) | a_1/12 ~ 6/9   (a_1 = 8) | 12 - 8   (4)
- **Look for:** AD from the ratio, then the leftover piece.
- **Why:** BC = 9. AD = 12 x 6/9 = 8. DC = 12 - 8 = 4.
- **Trap:** Answering 8 (that is AD).
- **Next time:** Parallel-segment questions often want the leftover piece: subtract at the end.

### GEO-36 · Solid from a slant height: chain the definitions in one list (hard)

A right pyramid has a square base with edge 10 inches. The slant height of each triangular face (from the middle of a base edge to the top) is 13 inches. What is the volume of the pyramid, in cubic inches?

- **Answer:** 400
- **Hint 1:** The height, half the base edge, and the slant height form a right triangle.
- **Hint 2:** Type [s, l, h] ~ [10, 13, sqrt(l^2 - (s/2)^2)], then compute (1/3)s^2 h.
- **Desmos:** [s, l, h] ~ [10, 13, sqrt(l^2 - (s/2)^2)]   (h = 12) | (1/3)s^2 h   (shows 400)
- **Look for:** h from the regression, then the volume line.
- **Why:** h = sqrt(13^2 - 5^2) = 12. V = (1/3)(100)(12) = 400.
- **Trap:** Using the slant height 13 as the height (433.3), or the full edge 10 in the right triangle.
- **Next time:** Solids: put every given length and every 'hidden' length into one list regression, then type the formula.
