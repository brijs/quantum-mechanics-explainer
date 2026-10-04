# Quantum Mechanics: The Theoretical Minimum — Explainer storyboard (v2, 51 scenes)

Guide: Professor Schrö. Layered style: story, picture, math, experiment. Check-yourself quizzes follow each lecture; tap dotted words for the glossary.

## 1. Open the box  (`s00`)
Welcome · the map of the book

> Meow. I'm Professor Shroh, and yes, I am both here and not here until you look. No background needed: we start from why quantum mechanics exists, and build up through all ten lectures of Susskind's Theoretical Minimum. Every idea comes in four layers: a plain story, a picture, the math, and an experiment you can run. Tap any dotted word for a definition, and take the check at the end of each lecture. Press a lecture to jump, or just press Next.

## 2. Why quantum mechanics exists  (`n1a`)
Lecture 1 · Why quantum mechanics exists

> Why do we need quantum mechanics at all? Fire bullets at a wall with two slits, and you get two piles behind it. Fire waves, and you get stripes, where the two ripples reinforce or cancel. Now fire electrons, one at a time. Each lands as a single dot, like a bullet, yet after thousands of dots the stripes of a wave appear. Stranger still, add a detector that sees which slit each electron used, and the stripes vanish. Try it, and watch the pattern build.

## 3. What is spin?  (`n1b`)
Lecture 1 · What is spin?

> So what is spin? Many particles behave like tiny bar magnets. Send a magnet through a magnetic field that is stronger at the top than the bottom, and it is pushed up or down according to its tilt. If tilts were random, the landing spots would smear into a continuous band. In 1922, Stern and Gerlach shot silver atoms through such a field and saw only two spots. That built-in magnetism is spin. It is not a ball turning; it is a property with just two allowed values along any axis. Compare the classical guess with nature.

## 4. Apparatus, preparing, measuring  (`n1c`)
Lecture 1 · Apparatus, preparing, measuring

> What is an apparatus? Think of a Stern Gerlach magnet plus a detector, pointed along a direction, like an arrow. It asks one question: is the spin along my arrow plus one, or minus one? To prepare a spin, pass atoms through one apparatus and keep only the plus ones; now we know its state. Then measure with a second apparatus. Pointing the same way, you always get plus one. Pointing opposite, never. Perpendicular, a fair coin. Try the three presets.

## 5. Probability and averages  (`n1d`)
Lecture 1 · Probability and averages

> Quantum mechanics predicts probabilities, so we need averages. Say plus one has probability p. Each shot gives plus or minus one, but the average of many shots approaches plus one times p, minus one times one minus p, which is two p minus one. That is called the expectation value. With N shots the typical error shrinks like one over root N, so single results look random while the statistics are precise. Choose p, fire more and more shots, and watch the average settle inside the shrinking band.

## 6. Spin is a coin that lies about its axis  (`s01`)
Lecture 1 · Systems and experiments

> Here is the first surprise. Prepare a spin up along z, then tilt your apparatus by an angle theta. If the spin were a little arrow of length one, you would expect to read a fraction, the cosine of theta. But every single shot still gives exactly plus one or minus one. Only the average equals cosine theta. The geometry of the arrow lives in the statistics, not in any single result. Tilt the apparatus, and fire.

## 7. Experiments are never gentle  (`s02`)
Lecture 1 · Measuring σz, then σx, then σz again

> Measuring a classical object can be gentle: a camera does not change where a ball is. A quantum measurement is not gentle. Prepare spin up along z, measure along x, then measure z again. Before the x measurement, z was certain. After it, z is a coin flip. Measuring one component forces the spin into a state that is undecided about the others. You cannot know spin along two different axes at once. Run the sequence, and watch certainty evaporate.

## 8. Check yourself: lecture 1  (`c1`)
3 questions · not graded, just to find gaps

> Time for a quick check on lecture one. Three questions. Do not worry about the score; a wrong answer just tells you which scene to revisit.

## 9. What is a state?  (`n2a`)
Lecture 2 · What is a state?

> What is a state? In classical physics, a state is a list of numbers that fixes the future: a coin is heads or tails, a ball has a position and a velocity. In quantum mechanics, a state is the complete recipe for predicting the probabilities of every possible measurement. For a spin, that recipe is surprisingly small: one direction in space. If the spin is certain along z, then x and y are fifty fifty. There is a budget of certainty, and it always adds up. Move the direction, and watch certainty shift between the three axes.

## 10. States are vectors  (`s03`)
Lecture 2 · Kets, bras, normalization

> How do we write the recipe down? As a vector. Up and down along z are two basic states, a basis, written ket u and ket d. Any state is a combination, called a superposition: alpha u times ket u, plus alpha d times ket d. The alphas are complex numbers called amplitudes, not probabilities. Stack them in a column and you have a ket. Flip it into a row and conjugate each entry, and you have a bra. Normalization says the squared sizes add to one. Slide the mix and the phase.

## 11. Inner products and phases  (`n2c`)
Lecture 2 · Inner products and phases

> The inner product is the overlap between two states. For ordinary vectors it is the dot product you already know: how much one points along the other. For kets it is a complex number, with a size and a phase, which we can draw as an arrow on the complex plane. The probability of finding state A, when the system is in state B, is the squared length of that arrow. Remarkably, it equals one half of one plus the cosine of the angle between the two directions on the sphere. Move both states, and check.

## 12. Amplitude, then probability  (`s04`)
Lecture 2 · P = |⟨a|b⟩|²

> Here is every overlap among six important states, as probabilities. The diagonal is one: a state is certainly itself. Up and down give zero, because they are orthogonal, meaning perfectly distinguishable. Up against right gives one half. Notice that up and down are orthogonal in state space, even though they point in opposite directions in ordinary space. Click any cell, and see the amplitude behind the probability.

## 13. Spin along other axes  (`n2d`)
Lecture 2 · Spin along other axes

> Now other axes. Right and left, along x, are equal mixtures of up and down, with a plus or minus sign between them, divided by root two so the probabilities add to one. In and out, along y, need an imaginary i in that sign. Real numbers alone only reach a circle of directions; complex numbers fill the whole sphere. That is why quantum mechanics needs complex amplitudes. Pick a state and an axis, fire a thousand shots, and compare with the exact prediction.

## 14. The Bloch sphere  (`s05`)
Lecture 2 · Every spin state is a direction

> Every spin state is a point on a sphere, called the Bloch sphere. Up is the north pole, down the south pole, and right, left, in and out sit around the equator. The state is cosine theta over two times up, plus e to the i phi, sine theta over two, times down. Two angles, one direction. Opposite points are orthogonal states. Drag the sphere, and watch the amplitudes follow.

## 15. Check yourself: lecture 2  (`c2`)
3 questions · not graded, just to find gaps

> Quick check on lecture two: kets, bras, amplitudes, and the sphere. Three questions.

## 16. Refresher: matrices and eigenvectors  (`n3a`)
Lecture 3 · Refresher: matrices and eigenvectors

> A refresher on matrices and eigenvectors, since quantum mechanics runs on them. A matrix is a machine that takes a vector and returns another, turning and stretching it. Most vectors get turned. But some special directions are only stretched or flipped. Those are eigenvectors, and the stretch factor is the eigenvalue. Soon, observables will be matrices, eigenvectors will be states with a definite answer, and eigenvalues will be the possible answers. Rotate the vector, and see when it stays on its own line.

## 17. Observables are operators  (`s06`)
Lecture 3 · Pauli matrices, eigenvectors, eigenvalues

> Here is the dictionary. Each measurable quantity, like spin along x, becomes a matrix. Apply the matrix to a ket. If the ket only gets multiplied by a number, it is an eigenvector, meaning the measurement gives that number for sure. Spin along z has eigenvectors up and down, with eigenvalues plus and minus one. Right and left are eigenvectors of sigma x, and in and out of sigma y. Click a cell to apply an operator to a ket.

## 18. Operators from eigenvectors  (`n3b`)
Lecture 3 · Operators from eigenvectors

> A beautiful fact: an observable is fully built from its eigenvectors and eigenvalues. For each eigenvector, form its projector, a ket times its bra, which picks out the part of any state lying along it. Multiply each projector by its eigenvalue, add them up, and you rebuild the matrix exactly. And the expectation of a projector, in a state, is the probability of that outcome. Choose an operator, and watch it assemble.

## 19. The four principles  (`s07`)
Lecture 3 · The rulebook (plus one waiting in lecture 4)

> Susskind boils the theory down to four principles. One: observables are linear operators. Two: the possible results are the eigenvalues. Three: distinguishable states are orthogonal. Four: probabilities are squared overlaps. Everything so far was these four. A fifth principle, about how states change in time, waits for lecture four. Flip each card, then try principle four on a state of your choosing.

## 20. Check yourself: lecture 3  (`c3`)
3 questions · not graded, just to find gaps

> Quick check on lecture three: operators, eigenvalues, and the principles. Three questions.

## 21. The classical rule: never merge states  (`n4a`)
Lecture 4 · The classical rule

> Lecture four asks how quantum states change. Start with the classical rule of thumb: the laws are deterministic and reversible. Two different states now must lead to two different states later, otherwise you could not run the movie backward. Susskind calls this the conservation of distinctions. Try some update rules on four states. A rotation or a swap keeps all four apart. A rule that merges two states loses information forever. The quantum version will say the same, in the language of orthogonal states.

## 22. Conservation of distinctions  (`s08`)
Lecture 4 · Time evolution must be unitary

> In quantum mechanics, perfectly distinguishable states are orthogonal. So the law of change must keep orthogonal states orthogonal, and keep total probability at one. A matrix with this property is called unitary: U dagger times U equals the identity. A rotation passes the test. The squashing matrix sends up and down to the same state, destroying the distinction, and fails. Try them.

## 23. Tiny steps of time  (`n4b`)
Lecture 4 · Tiny steps of time

> How do we build change in time from unitary matrices? Take a very small time step, epsilon. The step must be almost the identity, so write it as one minus i epsilon H. For this to be unitary to first order, H must equal its own conjugate transpose: it must be Hermitian. This matrix H is the Hamiltonian, the energy observable. Chain many tiny steps and you get smooth evolution. Choose the number of steps, and watch the naive product approach the exact answer.

## 24. The Hamiltonian drives the spin  (`s09`)
Lecture 4 · iħ d|ψ⟩/dt = H|ψ⟩ with H = (ħω/2)σz

> Letting epsilon shrink gives the Schroedinger equation: i h bar times the rate of change of the ket equals H times the ket. For a spin in a magnetic field along z, H is h bar omega over two times sigma z. The solution multiplies up by a phase, and down by the opposite phase. On the Bloch sphere, that is a steady precession about the z axis at frequency omega. Slide omega and the starting angle.

## 25. Stationary states  (`n4c`)
Lecture 4 · Stationary states

> An energy eigenstate is a state of definite energy. Under the Schroedinger equation it only picks up an overall phase, which no experiment can see. So every measurement probability stays constant: it is a stationary state. A superposition of two different energies has a relative phase that rotates, at a frequency set by the energy difference, so the probabilities oscillate. Choose a starting state, and watch the three curves.

## 26. Check yourself: lecture 4  (`c4`)
3 questions · not graded, just to find gaps

> Quick check on lecture four: unitarity, the Hamiltonian, and stationary states. Three questions.

## 27. Order matters  (`n5a`)
Lecture 5 · Order matters

> Quantum operators have a surprising property: order matters. Rotate a book ninety degrees about one axis, then another, and it ends up differently than if you swap the order. Matrices behave the same way. Apply sigma x then sigma z to a ket, and compare with sigma z then sigma x. The results differ, by a sign. The commutator measures exactly this difference. Choose a state and two operators, and compare the two orders.

## 28. Commutators  (`s10`)
Lectures 4–5 · [A,B] = AB − BA

> The commutator of A and B is A B minus B A. If it is zero, the order does not matter, and the two observables can be sharp together. For Pauli matrices on different axes it is never zero: the commutator of sigma x and sigma y is two i sigma z. Susskind notes that classical Poisson brackets turn into commutators divided by i h bar, linking old and new mechanics. Pick any pair.

## 29. The uncertainty principle  (`s11`)
Lecture 5 · ΔA·ΔB ≥ ½|⟨[A,B]⟩|

> Here is the payoff: the generalized uncertainty principle. The product of the two spreads is at least one half the size of the expected commutator. This is not clumsy measuring; it is built into the states themselves. No state has sharp values of two non-commuting quantities. Pick two operators, choose a state, and watch the product hug that bound but never dip below it. Then sample a thousand random states, and hunt for a violation.

## 30. Time dependence and conservation  (`s12`)
Lecture 5 · d⟨L⟩/dt = (i/ħ)⟨[H,L]⟩

> How does an average change in time? Its rate equals i over h bar, times the expectation of the commutator of H with the observable. If that commutator vanishes, the quantity is conserved: this is how conservation laws arise. Aim the magnetic field anywhere: the spin component along the field never changes, while the others rotate around it. Move the field and the spin, and compare the formula with the curves.

## 31. Check yourself: lecture 5  (`c5`)
3 questions · not graded, just to find gaps

> Quick check on lecture five: commutators, uncertainty, and conservation. Three questions.

## 32. Two systems, one state  (`n6a`)
Lecture 6 · Two systems, one state

> Now combine two systems. Two ordinary coins have four joint outcomes, two times two, not two plus two. Quantum mechanics keeps that structure: two spins have four basis states, up up, up down, down up, and down down, and a state assigns an amplitude to each. If the spins are independent, the joint amplitude is simply the product of the individual ones. Set each spin's direction, and watch the four joint probabilities.

## 33. Combining systems  (`s13`)
Lecture 6 · Tensor products: product versus entangled

> But not every four-component state is a product of two single-spin states. A product has amplitudes that factorize: a d equals b c. When a d minus b c is not zero, no factorization exists, and the pair is entangled: neither spin has a state of its own, only the pair does. Slide the four amplitudes, and find the boundary between product and entangled.

## 34. The singlet: Alice and Bob  (`s14`)
Lecture 6 · |sing⟩ = (|ud⟩ − |du⟩)/√2

> Meet the singlet: up down minus down up, over root two. Alice and Bob each measure their own spin, far apart. Along the same axis, they always get opposite answers, yet each alone sees a fair coin. Tilt the axes, and the correlation becomes minus cosine of the angle between them. Note that Bob's results alone never reveal what Alice did, so no message is sent. Fire some pairs.

## 35. Check yourself: lecture 6  (`c6`)
3 questions · not graded, just to find gaps

> Quick check on lecture six: combined systems and entanglement. Three questions.

## 36. Density matrix and entanglement  (`s15`)
Lectures 6–7 · Pure whole, mixed part

> Alice holds only her half of an entangled pair. What is her state? Not a ket, but a density matrix, found by tracing out Bob. For a product state it is pure. For the singlet it is half the identity: maximal ignorance about Alice, despite perfect knowledge of the pair. Entropy measures that ignorance. Slide from product to singlet, and watch the entropy rise to one bit.

## 37. Einstein's hidden answers  (`n7a`)
Lecture 7 · Einstein's hidden answers

> Einstein suspected that quantum randomness hides pre-written answers: each particle carries instructions. Bell asked what such a theory could predict. Suppose Alice has two settings, Bob two, and every pair carries plus or minus one answers for all four. Combine them as A B minus A B prime plus A prime B plus A prime B prime. Factor it: one bracket is zero, the other is plus or minus two, so the total is always plus or minus two, and averages cannot exceed two. Toggle the four answers, and see.

## 38. Bell and the CHSH test  (`s16`)
Lecture 7 · Quantum breaks the classical ceiling of 2

> Now quantum mechanics enters. For the singlet, the correlation between settings is minus the cosine of their angle. Choose the angles well, and the same combination reaches two root two, bigger than the classical limit of two. Experiments confirm the quantum value. So no local hidden-variable theory can explain nature. Choose four angles, or press optimal, and watch quantum break the classical ceiling.

## 39. Check yourself: lecture 7  (`c7`)
3 questions · not graded, just to find gaps

> Quick check on lecture seven: density matrices and Bell's test. Three questions.

## 40. Wave functions and position  (`n8a`)
Lecture 8 · Wave functions and position

> Lecture eight moves from two outcomes to infinitely many: position along a line. The state becomes a wave function, psi of x: a complex amplitude for every position, like a ket with infinitely many components. Its squared magnitude is the probability density. Detect particles one at a time, and each lands at a single point, but the histogram slowly traces the density. Choose a shape, pick an interval, and compare the area with the fraction of counts.

## 41. Wave functions and Fourier  (`s17`)
Lecture 8 · ψ(x), φ(p) and Δx·Δp ≥ ħ/2

> You may know Fourier's idea: any signal is a sum of sine waves. In quantum mechanics, wavelength sets momentum, so the momentum amplitude is the Fourier transform of psi. A narrow packet needs many wavelengths and is broad in momentum; a wide packet is narrow. That tradeoff is delta x times delta p at least h bar over two. Reshape the packet, and watch the two plots.

## 42. Position, momentum, and [X,P]  (`s18`)
Lecture 8 · P = −iħ d/dx, plane waves, de Broglie

> Position acts by multiplying by x. Momentum acts as minus i h bar, d by d x. A plane wave is a momentum eigenstate, with p equal to h bar k: the de Broglie relation. And since x and p do not commute, their commutator is i h bar. This one equation is the root of the uncertainty principle for particles. Test it numerically on any function.

## 43. Check yourself: lecture 8  (`c8`)
3 questions · not graded, just to find gaps

> Quick check on lecture eight: wave functions, momentum, and the commutator of x and p. Three questions.

## 44. Kinetic energy is curvature  (`n9a`)
Lecture 9 · Kinetic energy as curvature

> Lecture nine builds dynamics for a particle. Classically the energy is p squared over two m, plus the potential energy V. Quantum mechanics promotes momentum to the operator minus i h bar d by d x, so kinetic energy becomes minus h bar squared over two m times the second derivative: curvature. A smooth, spread-out wave has little kinetic energy; a tightly wiggling one has a lot. Change the width and the wiggle, and check three ways of computing the average kinetic energy.

## 45. The Schrödinger wave equation  (`s19`)
Lecture 9 · iħ ∂ψ/∂t = −(ħ²/2m)∂²ψ/∂x² + Vψ (numerical illustration)

> Put it together: i h bar times the rate of change of psi equals H psi, with H equal to p squared over two m plus V. A free packet drifts and spreads, as the uncertainty principle demands. A barrier reflects most of it, but some leaks through, a purely quantum effect called tunnelling. A harmonic well makes the packet oscillate, like a classical particle. Throughout, total probability stays one. Pick a potential, and release.

## 46. Check yourself: lecture 9  (`c9`)
3 questions · not graded, just to find gaps

> Quick check on lecture nine: kinetic energy, the wave equation, and tunnelling. Three questions.

## 47. Classical versus quantum oscillator  (`n10a`)
Lecture 10 · Classical versus quantum oscillator

> Lecture ten treats the harmonic oscillator: a mass on a spring, and the model for vibrations everywhere. A classical oscillator moves slowest near its turning points, so it is most likely found there. The quantum ground state looks nothing like that: a single bump in the middle. But raise the energy level n, and the quantum probability grows n wiggles whose average follows the classical curve. This is the correspondence principle. Slide n, and compare.

## 48. The harmonic oscillator ladder  (`s20`)
Lecture 10 · a†|n⟩ = √(n+1)|n+1⟩, E = ħω(n + ½)

> Now the elegant part. Two ladder operators, a and a dagger, climb between energy levels. A dagger lifts the energy by h bar omega, a lowers it, and a acting on the ground state gives zero, so there is a floor: the zero point energy. Energies are h bar omega times n plus one half. All of it follows from one commutator, a with a dagger equals one. Climb the ladder, and watch nodes appear.

## 49. Check yourself: lecture 10  (`c10`)
3 questions · not graded, just to find gaps

> Last check, on lecture ten: the oscillator and its ladder. Three questions.

## 50. Quantum lab (free play)  (`s21`)
Everything at once: state → operators → measurement

> Time to play. This is your quantum lab. Choose a state on the sphere, apply operators, and fire measurements to compare the histogram with the Born rule. Everything you have learned lives in these few controls. Break things, then come to the final exam.

## 51. Final exam and cheat sheet  (`s22`)
Ten questions, one per lecture · pass at 8

> Final exam. Ten questions across all ten lectures. Score at least eight, and you earn the title Master of the Ket. Afterwards, take the cheat sheet home. Whether the cat is alive is up to you.
