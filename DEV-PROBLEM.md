Motivations

[Technical Documentation](./DOCUMENTATION.md)

# Brief

I'm generally concerned by the problem of having a dependency stack that looks 
like:

1.  W3.org / Browser Vendors
2.  `[ missing layer ]`
3.  (pick your favourite) language runtime
4.  (pick your favourite) framework for (3)

... because this results in different interpretations and expressions of how to 
address (1). This means that every time I use a new (3) or (4), I find they all 
implement different interpretations of (1). 

**IF THIS PROBLEM INTERESTS YOU, THEN MAYBE IT IS USEFUL TO CONTINUE READING**

I'm looking for something at (2) which is more rigid than (1), whereby every 
time we use a new (3) or (4), we can retarget to implement all the (3s) and (4s) 
to fit the same rigid target of (2).

Since I couldn't find (2) in the wild, I started working on it ... of course, 
it's not going to be complete for a while. But it's under active development, 
and will soon be used in production for internal apps at my day job. 

Feel free to jump into a discussion on the repo ... in the comments, or just PM 
me. :)

## Meta

The following nouns are asserted to being equivalent for the purpose of this
README:

-   software framework
-   software development kit
-   software design pattern
-   kit (for brevity)

## Kit

This kit addresses the complexities of developing *web applications*. 

This is meant to be a *language-agnostic* and *runtime-agnostic* kit. This kit
may be implemented in any / many languages and runtimes.

### Reference Kit 

Since the *lingua franca* of the web is ECMAScript, the *reference
kit* is currently being draughted in ECMAScript.  Since the dominant
runtime for ECMAScript is currently NodeJS, the reference kit is
adequately coherent with that. Specifically the reference kit is
implemented in the NodeJS runtime on AWS Lambda, because well, currently AWS is
the dominant public cloud (and that's how I ended up developing on it).

## My Context

This is not expected to be your context.

Consciousness is boring because in the long run, there is only one way to think
about anything, and local instances are just results of upstream idiosyncrasies
in the evolution of things that think. Web development is probably the same.
There will be at the end of time only one correct way to write a web development
app, because it is the quickest, stripped of cultural nuances. We just don't
know what it is yet, because the web wasn't designed in a very proper fashion,
and so we have hundreds of frameworks (attempts) to make sense of the mess. Well
that's the nature of evolution, I suppose. Most of these frameworks will die a
boring and uncelebrated mess. Probably, so will this one. But for the span of
their respective lives all frameworks are expected to be useful - I suppose
frameworks are people too.

### Motivation

I've been building webpages since the year 2000 or thenabouts, and using
web-development frameworks since 2009, and I hope to god that I won't have to
redesign another web-development framework after this. Hopefully I'll be able to
just reimplement the same pattern in whatever language or runtime I need to work
in henceforth.

### Reuse in Pedagogy 

I never studied web development as an academic subject. In the process of
learning how to write frameworks from scratch, I've figured there is just enough
material in this for the syllabus of one moderately challenging 200-level
college course. Credit should be assigned on a weekly basis, of course, with
adequate warnings to students that if they don't get the first parts right, the
end result will simply not function. The courses should probably be pass/fail.