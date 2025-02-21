export const onSubmit = async (reviewData) => {
    try {
        const response = await fetch('http://localhost:3000/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData), 
        });

        if (!response.ok) {
            throw new Error('Wystąpił problem z wysłaniem recenzji');
        }
        console.log(reviewData)

        const data = await response.json();
        console.log('Recenzja została wysłana:', data);
    } catch (error) {
        console.error('Błąd:', error);
    }
};
